var sqlite3 = require('sqlite3').verbose();
var user = exports;


user.insert = "INSERT INTO User(id, firstname, lastname, email, password, salt) " +
  "VALUES(?, ?, ?, ?, ?, ?);";


