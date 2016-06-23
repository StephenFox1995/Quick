const sqlite3 = require('sqlite3').verbose();
const usersql = require('usersql');

var database = exports;


/**
 * Inserts a user into the database.
 * @param user The user to add to the databaase.
 **/
database.insertUser = function (user) {
  getConnection(function (db) {
    const insertQuery = usersql.insert;
    db.run(query,
      user.id,
      user.firstname,
      user.lastname,
      user.email,
      user.password,
      user.salt);
  });
};


/**
 * Get a connection to the database file stored on disk.
 **/
database.getConnection = function (callback) {
  // TODO: Attach this to a global.
  const filepath = '/Users/stephenfox/Desktop/quick.db';
  var db = new sqlite3.Database(filepath);
  callback(db);
};


module.exports = database;