const db = require('./src/database');
const { Library } = require('./src/library');

const library = new Library(db);

const getBooks = () => {
  library.getBooks(db).then((books) => {
    console.table(books);
  });
};

const getAvailableBooks = () => {
  library.getAvailableBooks(db).then((books) => {
    console.table(books);
  });
};

const main = () => {
  getBooks();
  getAvailableBooks();
};

main();
