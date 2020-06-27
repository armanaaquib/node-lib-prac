const prompt = require('prompt-sync')();

const { db, bookParser, copyParser, logParser } = require('./src/database');
const { Library } = require('./src/library');

const library = new Library(db, bookParser, copyParser, logParser);

const get = (op, next) => {
  library[op]().then(console.table).then(next);
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

const displayBookProperties = () => {
  console.log('ISBN', 'title', 'book_category', 'publisher_name');
};

const filterBooks = (next) => {
  displayBookProperties();
  const property = prompt('enter property: ');
  const value = prompt('enter value: ');

  library.filterBooksBy(property, value).then(console.table).then(next);
};

const filterAvailableBooks = (next) => {
  displayBookProperties();
  const property = prompt('enter property: ');
  const value = prompt('enter value: ');

  library
    .filterAvailableBooksBy(property, value)
    .then(console.table)
    .then(next);
};

const issueBook = (next) => {
  const serialNo = prompt('enter serial_no: ');
  const userId = prompt('user id: ');

  library.issueBook(serialNo, userId).then((res) => {
    if (res) {
      library
        .filterLogs('library_user_id', userId)
        .then(console.table)
        .then(next);
    } else {
      console.log(serialNo, 'not found');
      next();
    }
  });
};

const returnBook = () => {
  library.returnBook('LIB00001', 25275).then((res) => console.log(res));
  get('getLogs');
  get('getBookCopies');
};

const listAllBooks = (askChoice) => {
  console.log('all books');
  get('getBooks', askChoice);
};

const listAllAvailableBooks = (askChoice) => {
  console.log('all available books');
  get('getAvailableBooks', askChoice);
};

const displayUserOptions = () => {
  console.log('1. list all books');
  console.log('2. list of all available books');
  console.log('3. filter all books by');
  console.log('4. filter all available books by');
  console.log('5. issue a book');
};

const userOps = () => {
  const ops = {
    1: listAllBooks,
    2: listAllAvailableBooks,
    3: filterBooks,
    4: filterAvailableBooks,
    5: issueBook,
    6: returnBook,
  };

  displayUserOptions();
  const choice = prompt('Enter your choice: ');
  ops[choice](userOps);
};

const main = () => {
  console.log('Welcome......');
  console.log('1. As a User');
  console.log('2. As a Librarian');

  const choice = prompt('Enter your choice: ');

  if (choice === '1') {
    console.log('Welcome...... User');
    userOps();
  }
};

main();
