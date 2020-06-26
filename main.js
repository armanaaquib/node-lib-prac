const { db, bookParser, copyParser, logParser } = require('./src/database');
const { Library } = require('./src/library');

const library = new Library(db, bookParser, copyParser, logParser);

const addBook = () => {
  library.addBook().then(() => {});
};

const getBooks = () => {
  library.getBooks().then((books) => {
    console.table(books);
  });
};

const getAvailableBooks = () => {
  library.getAvailableBooks().then((books) => {
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
  // addBook();
  // getBooks();
  getPopularBooks();
  // getAvailableBooks();
};

main();
