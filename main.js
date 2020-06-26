const {db, bookParser, copyParser, logParser} = require('./src/database');
const {Library} = require('./src/library');

const library = new Library(db, bookParser, copyParser, logParser);

const addBook = () => {
  library.addBook().then(() => {});
};

const getBooks = () => {
  library.getBooks().then((books) => {
    console.table(books);
  });
};

const getBookCopiesTable = () => {
  library.getBookCopies().then((books) => {
    console.table(books);
  });
};

const getLibraryLogTable = () => {
  library.getLogs().then((books) => {
    console.table(books);
  });
};

const getPopularBooks = () => {
  library.popularBooks().then((books) => {
    console.table(books);
  });
};

const main = () => {
  getBooks();
  getBookCopiesTable();
  getLibraryLogTable();
};

main();
