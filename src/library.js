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
    const sql = 'SELECT * FROM book_titles';
    return runSql(sql, [], this.db.all.bind(this.db));
  }

  getAvailableBooks() {
    //this.bookTitles
    // this.bookCopies
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
