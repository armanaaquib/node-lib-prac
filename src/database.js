const sqlite3 = require('sqlite3').verbose();

const throwError = (err) => {
  if (err) {
    throw err;
  }
};

const db = new sqlite3.Database('./data/lib.db', throwError);

const bookTableSql = ` CREATE TABLE IF NOT EXISTS book_titles (
  ISBN VARCHAR(50) PRIMARY KEY,
  title VARCHAR(50),
  author_1 VARCHAR(25),
  author_2 VARCHAR(25),
  author_3 VARCHAR(25),
  number_of_copies_total NUMERIC(3),
  publisher_name VARCHAR(25),
  book_category VARCHAR(30)
)`;
db.run(bookTableSql, [], throwError);

const bookCopiesTableSql = ` CREATE TABLE IF NOT EXISTS book_copies(
  serial_number VARCHAR(10),
  ISBN VARCHAR(50),
  enrolled_date DATE,
  available_from DATE,
  is_available BOOLEAN,
  issued_date DATE,
  library_user_id NUMERIC(5)
)`;
db.run(bookCopiesTableSql, [], throwError);

const libraryLogTableSql = `CREATE TABLE IF NOT EXISTS library_log(
  action VARCHAR(10),
  date_of_action DATE,
  library_user_id NUMERIC(5),
  serial_number VARCHAR(10)
)`;
db.run(libraryLogTableSql, [], throwError);

module.exports = db;
