const sqlite3 = require('sqlite3').verbose();
const { ModelStatementParser } = require('./statementParser');

const throwError = (err) => {
  if (err) {
    throw err;
  }
};

const db = new sqlite3.Database('./data/lib.db', throwError);

const bookSchema = [
  'ISBN VARCHAR(50) PRIMARY KEY',
  'title VARCHAR(50)',
  'author_1 VARCHAR(25)',
  'author_2 VARCHAR(25)',
  'author_3 VARCHAR(25)',
  'number_of_copies_total NUMERIC(3)',
  'publisher_name VARCHAR(25)',
  'book_category VARCHAR(30)',
];

const bookParser = new ModelStatementParser(bookSchema, 'book_titles');
const bookTableSql = bookParser.createTable();
db.run(bookTableSql, [], throwError);

const copySchema = [
  'serial_number INTEGER PRIMARY KEY AUTOINCREMENT',
  'ISBN VARCHAR(50)',
  'enrolled_date DATE',
  'available_from DATE',
  'is_available BOOLEAN',
  'issued_date DATE',
  'library_user_id NUMERIC(5)',
];
const copyParser = new ModelStatementParser(copySchema, 'book_copies');
const copyTableSql = copyParser.createTable();
db.run(copyTableSql, [], throwError);

const libraryLogSchema = [
  'action VARCHAR(10)',
  'date_of_action DATE',
  'library_user_id NUMERIC(5)',
  'serial_number INTEGER',
];
const logParser = new ModelStatementParser(libraryLogSchema, 'library_log');
const libraryLogTableSql = logParser.createTable();
db.run(libraryLogTableSql, [], throwError);

module.exports = { db, bookParser, copyParser, logParser };
