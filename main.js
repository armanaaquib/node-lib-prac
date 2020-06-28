const prompt = require('prompt-sync')();
const { db, bookParser, copyParser, logParser } = require('./src/database');
const { Library } = require('./src/library');
const { userOps } = require('./src/userOps');
const { librarianOps } = require('./src/libraryOps.js');

const main = () => {
  console.log('Welcome......');
  console.log('1. As a User');
  console.log('2. As a Librarian');

  const library = new Library(db, bookParser, copyParser, logParser);
  const choice = prompt('Enter your choice: ');

  if (choice === '1') {
    console.log('Welcome...... User');
    userOps(library);
  }

  if (choice === '2') {
    console.log('Welcome...... Librarian');
    librarianOps(library);
  }
};

main();
