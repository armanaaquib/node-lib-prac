const { db, bookParser, copyParser, logParser } = require('./src/database');
const { Library } = require('./src/library');

const library = new Library(db, bookParser, copyParser, logParser);

const getDetails = (detailType) => {
  library[detailType]().then(console.table);
};

const addBook = () => {
  const bookDetails = [
    '5 , "The code book", "Simon Sing", null, null, 1, "unknown", "Encryption"',
  ];
  const copyDetails = [
    "'LIB00007', 5, true, date('now'), date('now', '+1 day'), null, null",
  ];
  library.addBook(bookDetails, copyDetails).then((res) => {
    console.table(res);
  });
};

const addCopy = () => {
  const copyDetails = [
    "'LIB00008', 5, date('now'), date('now', '+1 day'), true, null, null",
  ];
  library.addCopy(5, copyDetails).then((res) => {
    console.table(res);
  });
};

const filterBooksBy = () => {
  library
    .filterBooksBy({ attribute: 'ISBN', value: '"ISBN1"' })
    .then((rows) => {
      console.table(rows);
    });

  library
    .filterBooksBy({ attribute: 'book_category', value: '"CSE"' })
    .then((rows) => {
      console.table(rows);
    });
};

const filterAvailableBooks = () => {
  library
    .filterAvailableBooksBy({ attribute: 'book_category', value: '"CSE"' })
    .then((rows) => {
      console.table(rows);
    });
};

const issueBook = () => {
  library.issueBook('LIB00003', 25275).then((res) => console.log(res));
  getDetails('getLogs');
  getDetails('getBookCopies');
};

const main = () => {
  getDetails('getBooks');
  getDetails('getLogs');
  // getDetails('defaulterUsers');
  // getDetails('popularBooks');
  // getDetails('regularUsers');
  getDetails('getBookCopies');
  // filterBooksBy();
  // filterAvailableBooks();
  issueBook();
  // addBook();
  // addCopy();
};

main();
