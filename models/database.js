'use strict';

const sqlite3 = require('sqlite3').verbose();
const globals = require('../libs/globals');
const userSQL = require('./userSQL');
const businessSQL = require('./businessSQL');
const orderSQL = require('./productSQL');
const database = exports;

/**
 * Database object shared by module.
 * */
var db;


/**
 * Inserts a User into the database.
 * @param user The user to add to the database.
 * @param callback Callback function.
 **/
database.insertUser = function (user, callback) {
  this.getConnection(function (db) {
    const insertQuery = userSQL.insert;
    // Insert user into database.
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
 * Inserts a Business into the database.
 * @param business The business to add to the database.
 * @param callback Callback function.
 **/
database.insertBusiness = function (business, callback) {
  this.getConnection(function (db) {
    const insertQuery = businessSQL.insert;
    // Insert business into database.
    db.run(insertQuery,
      [business.id,
       business.name,
       business.address,
       business.contactNumber,
       business.email,
       business.hashedPassword],
       callback);
    });
};


/**
 * Insert an Order into the database.
 * @param order The order to add to the database.
 * @param callback Callback function.
 * */
database.insertOrder = function (order, callback) {
  this.getConnection(function (db) {
    const insertQuery = orderSQL.insert;
    db.run(insertQuery,
          [order.id,
          order.name,
          order.price,
          order.description,
          order.businessID],
          callback);
  });
};



/*
 * Get a connection to the database file stored on disk.
 **/
database.getConnection = function (callback) {
  // Check to see if connection to database already exists.
  if (db) {
    callback(db);
  } else {
    db = new sqlite3.Database(globals.Globals.dbLocation);
    callback(db);
  }
};
