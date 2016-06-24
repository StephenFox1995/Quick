'use strict';

const sqlite3 = require('sqlite3').verbose();
const globals = require('../libs/globals');
const usersql = require('../models/usersql');
const database = exports;

/**
 * Database object shared by module.
 * */
var db;


/**
 * Inserts a user into the database.
 * @param user The user to add to the databaase.
 * @param callback Callback function.
 **/
database.insertUser = function (user, callback) {
  this.getConnection(function (db) {
    const insertQuery = usersql.insert;
    // Insert user into databse.
    db.run(insertQuery,
      [user.id,
      user.firstname,
      user.lastname,
      user.email,
      user.password],
      callback);
  });
};


/**
 * Get a connection to the database file stored on disk.
 **/
database.getConnection = function (callback) {
  db = new sqlite3.Database(globals.Globals.dbLocation);
  callback(db);
};
