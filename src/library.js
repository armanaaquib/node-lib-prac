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

  addBook(bookDetail, bookCopiesDetail) {
    // this.booksTitles
    // this.bookCopies
  }

  addCopy(ISBN, copyDetail) {
    // this.booksTitles
    // this.bookCopies
  }

  popularBooks() {
    //this.libraryLog
  }

  regularUsers() {
    //this.libraryLog
  }

  defaulterUsers() {
    //this.libraryLog
  }
}

module.exports = { Library };
