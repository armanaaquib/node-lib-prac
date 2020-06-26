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
  constructor(db) {
    this.db = db;
  }

  getBooks() {
    const sql = ` SELECT
        title,
        book_category,
        author_1,
        author_2,
        author_3
      FROM
        book_titles`;

    return runSql(sql, [], this.db.all.bind(this.db));
  }

  getAvailableBooks() {
    const sql = `
    SELECT
      DISTINCT title,
      count(title) OVER(PARTITION BY title) as no_of_copies_available,
      author_1,
      author_2,
      author_3,
      publisher_name,
      book_category
    FROM
      book_titles
      INNER JOIN book_copies ON book_titles.ISBN = book_copies.ISBN
    WHERE
      is_available = ?
      and date('now') >= available_from`;

    return runSql(sql, [true], this.db.all.bind(this.db));
  }

  filterBooksBy(cause) {
    // this.booksTitles
  }

  filterAvailableBooksBy(cause) {
    // this.booksTitles
    // this.bookCopies
  }

  issueBook(serialNumber, userId) {
    // this.bookCopies
    // this.libraryLog
  }

  returnBook(serialNumber, userId) {
    // this.bookCopies
    // this.libraryLog
  }

  addBook(bookTitles, bookCopies, bookDetail, bookCopiesDetail) {
    const insertionDetail = {
      columns: bookTitles,
      values: bookDetail,
    };
    const sql1 = this.book_titles.insert(insertionDetail);
    const insertionDetail = {
      columns: bookCopies,
      values: bookCopiesDetail,
    };
    const sql1 = this.book_copies.insert(insertionDetail);
    return (
      runSql(sql1, [], this.db.all.bind(this.db)) && runSql(sql2, [], this.db.all.bind(this.db))
    );
  }

  addCopy(ISBN, bookDetail, copyDetail) {
    const updationDetail = {
      columns: ['no_of_copies_total=no_of_copies +1'],
      where: [`ISBN=${ISBN}`],
    };
    const updateSQL = this.book_titles.update(updationDetail);
    const insertionDetail = {
      columns: bookDetail,
      values: copyDetail,
    };
    const sql = this.book_copies.insert(insertionDetail);
    return (
      runSql(sql, [], this.db.all.bind(this.db)) && runSql(updateSQL, [], this.db.all.bind(this.db))
    );
  }

  popularBooks() {
    const queryDetails = {
      columns: ['serial_number', 'count(serial_number) occurring_time', 'serial_number'],
      where: "action = 'issue' AND date_of_action BETWEEN date('now', '-1year') AND date('now')",
      groupBy: 'serial_number',
    };
    const queryDetails2 = {
      columns: ['occurring_time', ' tab1.serial_number', 'tab2.ISBN', 'tab3.title'],
    };

    const subSql = this.library_log.select(queryDetails).slice(0, -1);
    const subSql2 = this.book_titles
      .select(queryDetails2)
      .replace(/book_titles/, 'issuedBook tab1');

    const sql = ` WITH issued_books as (
                  ${subSql})
                  ${subSql2}
                  Left join ${this.book_copies} tab2
                  ON tab1.serial_number = tab2.serial_number

                  LEFT join ${this.book_titles} tab3
                  ON tab2.ISBN = tab3.ISBN
                  order by occurring_time DESC;`;
    return runSql(sql, [], this.db.all.bind(this.db));
  }

  regularUsers() {
    const queryDetails = {
      columns: ['max(library_user_id)'],
    };
    const sql = this.library_log.select(queryDetails);
    return runSql(sql, [], this.db.all.bind(this.db));
  }

  defaulterUsers() {
    const queryDetails = {
      columns: ['issued_date', 'library_user_id', 'serial_number'],
      where: "is_available = false AND issued_date < date('now', '-10 day')",
    };
    const sql = this.book_copies.select(queryDetails);
    return runSql(sql, [], this.db.all.bind(this.db));
  }
}

module.exports = {Library};
