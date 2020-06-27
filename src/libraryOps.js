const prompt = require('prompt-sync')();
const {displayLibrarianOps} = require('./displayer');
const {
  get,
  listAllBooks,
  listAllAvailableBooks,
  filterBooks,
  filterAvailableBooks,
  userHistory,
} = require('./commonQuery');

const popularBooks = (library, next) => {
  get('popularBooks', library, next);
};

const regularUsers = (library, next) => {
  get('regularUsers', library, next);
};

const defaulterUsers = (library, next) => {
  get('defaulterUsers', library, next);
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

const addBook = (library, next) => {
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
  library
    .addBook(bookDetails, copyDetails)
    .then(console.table)
    .then(() => next(library));
};

const addCopy = (library, next) => {
  const ISBN = prompt('Enter ISBN: ');
  const copyDetails = generateCopyDetails(ISBN, 1);
  library
    .addCopy(ISBN, copyDetails)
    .then(console.table)
    .then(() => next(library));
};

const librarianOps = (library) => {
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
  ops[choice](library, librarianOps);
};

module.exports = {librarianOps};
