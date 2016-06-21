var sqlite3 = require('sqlite3').verbose();
var user = exports;


user.insert = function (db, id, firstname, lastname) {
  var insert = "INSERT INTO User(id, firstname, lastname) VALUES(?, ?, ?);";
  db.run(insert, [id, firstname, lastname]);
};

