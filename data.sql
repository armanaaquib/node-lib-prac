PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE book_titles(ISBN VARCHAR(50) PRIMARY KEY,title VARCHAR(50),author_1 VARCHAR(25),author_2 VARCHAR(25),author_3 VARCHAR(25),number_of_copies_total NUMERIC(3),publisher_name VARCHAR(25),book_category VARCHAR(30));
CREATE TABLE book_copies(serial_number INTEGER PRIMARY KEY AUTOINCREMENT,ISBN VARCHAR(50),enrolled_date DATE,available_from DATE,is_available BOOLEAN,issued_date DATE,library_user_id NUMERIC(5));
CREATE TABLE library_log(action VARCHAR(10),date_of_action DATE,library_user_id NUMERIC(5),serial_number INTEGER);
DELETE FROM sqlite_sequence;
COMMIT;
