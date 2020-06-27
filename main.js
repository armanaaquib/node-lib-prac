const prompt = require('prompt-sync')();

const {db, bookParser, copyParser, logParser} = require('./src/database');
const {Library} = require('./src/library');

const library = new Library(db, bookParser, copyParser, logParser);

const get = (op, next) => {
  library[op]().then(console.table).then(next);
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

  library.filterAvailableBooksBy(property, value).then(console.table).then(next);
};

const issueBook = (next) => {
  const serialNo = prompt('enter serial_no: ');
  const userId = prompt('user id: ');

  library.issueBook(serialNo, userId).then((res) => {
    if (res) {
      library.filterLogs('library_user_id', userId).then(console.table).then(next);
    } else {
      console.log(serialNo, 'not found');
      next();
    }
  });
};

const returnBook = (next) => {
  const serialNo = prompt('enter serial_no: ');
  const userId = prompt('user id: ');

  library.returnBook(serialNo, userId).then((res) => {
    if (res) {
      library.filterLogs('library_user_id', userId).then(console.table).then(next);
    } else {
      console.log(serialNo, 'invalid');
      next();
    }
  });
};

const userHistory = (next) => {
  const userId = prompt('user id: ');
  library.filterLogs('library_user_id', userId).then(console.table).then(next);
};

const listAllBooks = (next) => {
  console.log('all books');
  get('getBooks', next);
};

const listAllAvailableBooks = (askChoice) => {
  console.log('all available books');
  get('getAvailableBooks', askChoice);
};

const displayCommonOptions = () => {
  console.log('1. list all books');
  console.log('2. list of all available books');
  console.log('3. filter all books by');
  console.log('4. filter all available books by');
  console.log('5. check user history');
};

const displayUserOptions = () => {
  displayCommonOptions();
  console.log('6. issue a book');
  console.log('7. return a book');
};

const userOps = () => {
  const ops = {
    1: listAllBooks,
    2: listAllAvailableBooks,
    3: filterBooks,
    4: filterAvailableBooks,
    5: userHistory,
    6: issueBook,
    7: returnBook,
  };

  displayUserOptions();
  const choice = prompt('Enter your choice: ');
  ops[choice](userOps);
};

const generateCopyDetails = function (ISBN, noOfCopies) {
  const copyDetails = [];
  while (noOfCopies) {
    const newCopy = `${ISBN}, true, date('now'), date('now', '+1 day'), null, null`;
    copyDetails.push(newCopy);
    noOfCopies--;
  }
  return copyDetails;
};

const addBook = (next) => {
  console.log('Enter given details...');
  const ISBN = prompt('Enter ISBN: ');
  const title = prompt('Enter title: ');
  const author1 = prompt('Enter author1: ');
  const author2 = prompt('Enter author2: ');
  const author3 = prompt('Enter author3: ');
  const noOfCopies = prompt('Enter noOfCopies: ');
  const publisherName = prompt('Enter publisherName: ');
  const category = prompt('Enter category: ');
  const bookDetails = [
    `${ISBN}, "${title}", "${author1}", "${author2}", "${author3}", ${noOfCopies}, "${publisherName}", "${category}"`,
  ];
  const copyDetails = generateCopyDetails(ISBN, noOfCopies);
  library.addBook(bookDetails, copyDetails).then(console.table).then(next);
};

const addCopy = () => {
  const copyDetails = ["'LIB00008', 5, date('now'), date('now', '+1 day'), true, null, null"];
  library.addCopy(5, copyDetails).then((res) => {
    console.table(res);
  });
};

const popularBooks = (next) => {
  get('popularBooks', next);
};

const regularUsers = (next) => {
  get('regularUsers', next);
};

const defaulterUsers = (next) => {
  get('defaulterUsers', next);
};

const displayLibrarianOps = () => {
  displayCommonOptions();
  console.log('6. add book');
  console.log('7. add copy');
  console.log('8. popular books');
  console.log('9. regular users');
  console.log('10. book pending users');
};

const librarianOps = () => {
  const ops = {
    1: listAllBooks,
    2: listAllAvailableBooks,
    3: filterBooks,
    4: filterAvailableBooks,
    5: userHistory,
    6: addBook,
    7: addCopy,
    8: popularBooks,
    9: regularUsers,
    10: defaulterUsers,
  };

  displayLibrarianOps();
  const choice = prompt('Enter your choice: ');
  ops[choice](librarianOps);
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

  if (choice === '2') {
    console.log('Welcome...... Librarian');
    librarianOps();
  }
};

main();
