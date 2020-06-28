const prompt = require('prompt-sync')();
const { displayUserOptions } = require('./displayer');
const {
  exitMessage,
  listAllBooks,
  listAllAvailableBooks,
  filterBooks,
  filterAvailableBooks,
  userHistory,
} = require('./commonQuery');

const issueBook = (library, next) => {
  const serialNo = prompt('enter serial_no: ');
  const userId = prompt('user id: ');

  library.issueBook(serialNo, userId).then((res) => {
    if (res) {
      library
        .filterLogs('library_user_id', userId)
        .then(console.table)
        .then(() => next(library));
    } else {
      console.log(serialNo, 'not found');
      next(library);
    }
  });
};

const returnBook = (library, next) => {
  const serialNo = prompt('enter serial_no: ');
  const userId = prompt('user id: ');

  library.returnBook(serialNo, userId).then((res) => {
    if (res) {
      library
        .filterLogs('library_user_id', userId)
        .then(console.table)
        .then(() => next(library));
    } else {
      console.log(serialNo, 'invalid');
      next(library);
    }
  });
};

const userOps = (library) => {
  const ops = {
    1: listAllBooks,
    2: listAllAvailableBooks,
    3: filterBooks,
    4: filterAvailableBooks,
    5: userHistory,
    6: issueBook,
    7: returnBook,
    '': exitMessage,
  };

  displayUserOptions();
  const choice = prompt('Enter your choice: ');
  ops[choice](library, userOps);
};

module.exports = { userOps };
