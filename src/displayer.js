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

const displayLibrarianOps = () => {
  displayCommonOptions();
  console.log('6. add book');
  console.log('7. add copy');
  console.log('8. popular books');
  console.log('9. regular users');
  console.log('10. book pending users');
};

module.exports = {displayLibrarianOps, displayUserOptions};
