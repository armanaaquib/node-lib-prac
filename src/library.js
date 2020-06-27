const runSql = (sql, params, runner) => {
  return new Promise((res, rej) => {
    runner(sql, params, (err, rows) => {
      if (err) {
        throw err;
      }

      res(rows);
    });
  });
};

class Library {
  constructor(db, bookParser, copyParser, logParser) {
    this.db = db;
    this.bookParser = bookParser;
    this.copyParser = copyParser;
    this.logParser = logParser;
  }

  getBooks() {
    const sql = this.bookParser.select({
      columns: this.bookParser.getColumns(),
    });
    return runSql(sql, [], this.db.all.bind(this.db));
  }

  getBookCopies() {
    const sql = this.copyParser.select({
      columns: this.copyParser.getColumns(),
    });
    return runSql(sql, [], this.db.all.bind(this.db));
  }

  getLogs() {
    const sql = this.logParser.select({ columns: this.logParser.getColumns() });
    return runSql(sql, [], this.db.all.bind(this.db));
  }

  getAvailableBooks() {
    const columns = this.bookParser.getColumns();
    columns.push(
      'count(title) OVER(PARTITION BY title) as no_of_copies_available'
    );
    let subSql = this.bookParser.select({ columns });

    subSql = subSql.replace(/ISBN/, 'DISTINCT book_titles.ISBN AS ISBN');
    console.log(subSql);
    subSql = subSql.replace(/number_of_copies_total,/, '');

    const sql = `  
    ${subSql}
      INNER JOIN book_copies ON book_titles.ISBN = book_copies.ISBN
    WHERE
      is_available = ?
      and date('now') >= available_from`;

    return runSql(sql, [true], this.db.all.bind(this.db));
  }

  filterBooksBy(attribute, value) {
    const where = `${attribute}="${value}"`;
    const sql = this.bookParser.select({
      columns: this.bookParser.getColumns(),
      where,
    });
    return runSql(sql, [], this.db.all.bind(this.db));
  }

  filterBookCopies(attribute, value) {
    const where = `${attribute}="${value}"`;
    const sql = this.copyParser.select({
      columns: this.copyParser.getColumns(),
      where,
    });
    return runSql(sql, [], this.db.all.bind(this.db));
  }

  filterLogs(attribute, value) {
    const where = `${attribute}="${value}"`;
    const sql = this.logParser.select({
      columns: this.logParser.getColumns(),
      where,
    });
    return runSql(sql, [], this.db.all.bind(this.db));
  }

  filterAvailableBooksBy(attribute, value) {
    const columns = this.bookParser.getColumns();
    columns.push(
      'count(title) OVER(PARTITION BY title) as no_of_copies_available'
    );
    let subSql = this.bookParser.select({ columns });

    subSql = subSql.replace(/ISBN/, 'DISTINCT book_titles.ISBN AS ISBN');
    console.log(subSql);
    subSql = subSql.replace(/number_of_copies_total,/, '');

    const sql = `
    ${subSql}
      INNER JOIN book_copies ON book_titles.ISBN = book_copies.ISBN
    WHERE
      is_available = ?
      and date('now') >= available_from
      and ${attribute}="${value}"`;

    return runSql(sql, [true], this.db.all.bind(this.db));
  }

  issueBook(serialNumber, userId) {
    const values = [`"issue", date('now'),  ${userId}, "${serialNumber}"`];
    const libLogInsertSql = this.logParser.insert({
      columns: this.logParser.getColumns(),
      values,
    });

    const updateBookCopySql = this.copyParser.update({
      columns: [
        'is_available = false',
        'issued_date = date("now")',
        `library_user_id = ${userId}`,
      ],
      where: `serial_number = '${serialNumber}'`,
    });

    const isAvailableSql = `
    SELECT
      count(serial_number) AS no_of_copies_available
    FROM
      book_copies
    WHERE
      is_available = true
      AND serial_number = '${serialNumber}'`;

    return new Promise((res, rej) => {
      this.db.get(isAvailableSql, (err, row) => {
        if (row.no_of_copies_available === 0) {
          return res(false);
        }

        this.db.parallelize(() => {
          this.db.run(libLogInsertSql);
          this.db.run(updateBookCopySql);
        });

        res(true);
      });
    });
  }

  returnBook(serialNumber, userId) {
    const values = [`"return", date('now'),  ${userId}, "${serialNumber}"`];
    const libLogInsertSql = this.logParser.insert({
      columns: this.logParser.getColumns(),
      values,
    });

    const updateBookCopySql = this.copyParser.update({
      columns: [
        'is_available = true',
        'issued_date = NULL',
        'library_user_id = NULL',
      ],
      where: `serial_number = '${serialNumber}'`,
    });

    const isCorrectCopySql = `
    SELECT
      count(serial_number) AS no_of_copies_available
    FROM
      book_copies
    WHERE
      is_available = false
      AND serial_number = '${serialNumber}'`;

    return new Promise((res, rej) => {
      this.db.get(isCorrectCopySql, (err, row) => {
        if (row.no_of_copies_available === 0) {
          return res(false);
        }

        this.db.parallelize(() => {
          this.db.run(libLogInsertSql);
          this.db.run(updateBookCopySql);
        });

        res(true);
      });
    });
  }

  addBook(bookDetail, bookCopiesDetail) {
    const insertionDetail = {
      columns: this.bookParser.getColumns(),
      values: bookDetail,
    };
    const insertBooksSql = this.bookParser.insert(insertionDetail);
    const copyInsertionDetail = {
      columns: this.copyParser.getColumns().slice(1),
      values: bookCopiesDetail,
    };
    const addedCopySql = this.copyParser.insert(copyInsertionDetail);
    const bookDetailsSql = this.copyParser.select({ columns: ['*'] });
    return new Promise((res, rej) => {
      this.db.serialize(() => {
        this.db
          .run(insertBooksSql)
          .run(addedCopySql)
          .all(bookDetailsSql, (err, rows) => {
            if (err) {
              throw err;
            }
            res(rows);
          });
      });
    });
  }

  addCopy(ISBN, copyDetail) {
    const updateDetail = {
      columns: ['number_of_copies_total = number_of_copies_total +1'],
      where: [`ISBN=${ISBN}`],
    };
    const updateTitleSql = this.bookParser.update(updateDetail);
    const insertionDetail = {
      columns: this.copyParser.getColumns(),
      values: copyDetail,
    };
    const insertBookCopySql = this.copyParser.insert(insertionDetail);
    const selectBookSql = this.bookParser.select({ columns: ['*'] });
    return new Promise((res, rej) => {
      this.db.serialize(() => {
        this.db
          .run(insertBookCopySql)
          .run(updateTitleSql)
          .all(selectBookSql, (err, rows) => {
            if (err) {
              throw err;
            }
            res(rows);
          });
      });
    });
  }

  popularBooks() {
    const queryDetails = {
      columns: [
        'serial_number',
        'count(serial_number) occurring_time',
        'serial_number',
      ],
      where:
        "action = 'issue' AND date_of_action BETWEEN date('now', '-1 year') AND date('now')",
      groupBy: 'serial_number',
    };
    const queryDetails2 = {
      columns: [
        'occurring_time',
        ' tab1.serial_number',
        'tab2.ISBN',
        'tab3.title',
      ],
    };

    const subSql = this.logParser.select(queryDetails);
    const subSql2 = this.bookParser
      .select(queryDetails2)
      .replace(/book_titles/, 'issued_books tab1');

    const sql = ` WITH issued_books as (
                  ${subSql})
                  ${subSql2}
                  Left join book_copies tab2
                  ON tab1.serial_number = tab2.serial_number

                  LEFT join book_titles tab3
                  ON tab2.ISBN = tab3.ISBN
                  order by occurring_time DESC
                  LIMIT 3`;
    return runSql(sql, [], this.db.all.bind(this.db));
  }

  regularUsers() {
    const queryDetails = {
      columns: ['max(library_user_id) regularUser'],
    };
    const sql = this.logParser.select(queryDetails);
    return runSql(sql, [], this.db.all.bind(this.db));
  }

  defaulterUsers() {
    const queryDetails = {
      columns: ['issued_date', 'library_user_id', 'serial_number'],
      where: "is_available = false AND issued_date < date('now', '-15 day')",
    };
    const sql = this.copyParser.select(queryDetails);
    return runSql(sql, [], this.db.all.bind(this.db));
  }
}

module.exports = { Library };
