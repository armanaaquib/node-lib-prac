const sqlite3 = require('sqlite3').verbose();
const { Library } = require('./src/library');

const db = new sqlite3.Database('../library_dbms/lib.db', (err) => {
  if (err) {
    throw err;
  }
});

const library = new Library(db);

const getBooks = () => {
  library.getBooks(db).then((books) => {
    console.table(books);
  });
};

const main = () => {
  getBooks();
};

main();
