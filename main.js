const prompt = require('prompt-sync')();

const { db, bookParser, copyParser, logParser } = require('./src/database');
const { Library } = require('./src/library');

const library = new Library(db, bookParser, copyParser, logParser);

const get = (op, askChoice) => {
  library[op]().then((rows) => {
    console.table(rows);
    askChoice();
  });
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

const filterAvailableBooksBy = () => {
  library
    .filterAvailableBooksBy({ attribute: 'book_category', value: '"CSE"' })
    .then((rows) => {
      console.table(rows);
    });
};

const issueBook = () => {
  library.issueBook('LIB00001', 25275).then((res) => console.log(res));
  get('getLogs');
  get('getBookCopies');
};

const returnBook = () => {
  library.returnBook('LIB00001', 25275).then((res) => console.log(res));
  get('getLogs');
  get('getBookCopies');
};

const userOps = () => {
  console.log('Welcome...... User');
  console.log('1. list all books');
  console.log('2. list of all available books');

  const ops = { 1: 'getBooks', 2: 'getAvailableBooks' };

  const askChoice = () => {
    const choice = prompt('Enter your choice: ');
    get(ops[choice], askChoice);
  };

  askChoice();
};

const main = () => {
  console.log('Welcome......');
  console.log('1. As a User');
  console.log('2. As a Librarian');

  const choice = prompt('Enter your choice: ');

  if (choice === '1') {
    userOps();
  }
};

main();
