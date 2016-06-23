var sqlite3 = require('sqlite3').verbose();
var user = exports;

// Create statement for User table
user.create = "CREATE TABLE User(         \
          id          STRING PRIMARY KEY, \
          firstname   STRING,             \
          lastname    STRING,             \
          email       STRING,             \
          password    STRING              \
        )";

// Insert statatement for User table.
user.insert = "INSERT INTO User(id, firstname, lastname, email, password) " +
  "VALUES(?, ?, ?, ?, ?);";


