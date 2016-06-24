const sqlite3 = require('sqlite3').verbose();
const globals = require('../libs/globals');
const usersql = require('../models/usersql');
const database = exports;


/**
 * Inserts a user into the database.
 * @param user The user to add to the databaase.
 **/
database.insertUser = function (user) {
  this.getConnection(function (db) {
    const insertQuery = usersql.insert;
    db.run(insertQuery,
      [user.id,
      user.firstname,
      user.lastname,
      user.email,
      user.password]);
  });
};


/**
 * Get a connection to the database file stored on disk.
 **/
database.getConnection = function (callback) {
  var db = new sqlite3.Database(globals.Globals.dbLocation);
  callback(db);
};
