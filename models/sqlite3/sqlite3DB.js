'use strict';

const sqlite3 = require('sqlite3').verbose();
const globals = require('../../libs/globals');
const userSQL = require('./userSQL');
const businessSQL = require('./businessSQL');
const productSQL = require('./productSQL');
const purchaseSQL = require('./purchaseSQL');
const database = exports;

const sqlite3DB = exports;

/**
 * Database object shared by module.
 **/
var db;


/***********************
 *  USER
 ***********************/

/**
 * Inserts a User into the sqlite3 database.
 * @param user The user to add to the database.
 * @param callback Callback function.
 **/
sqlite3DB.insertUser = function (user, callback) {
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

database.getAllUsers = function (callback) {
  this.getConnection(function (db) {
    const sqlQuery = userSQL.all;
    db.all(sqlQuery, callback);
  });
};

database.getUser = function (id, callback) {
  this.getConnection(function (db) {
    const sqlQuery = userSQL.getUser;
    db.get(sqlQuery, [id], callback);
  });
};


/***********************
 *  BUSINESS
 ***********************/

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

database.getAllBusiness = function (callback) {
  this.getConnection(function (db) {
    const sqlQuery = businessSQL.all;
    db.all(sqlQuery, callback);
  });
};



/***********************
 *  PRODUCT
 ***********************/

/**
 * Insert an Product into the database.
 * @param product The order to add to the database.
 * @param callback Callback function.
 * */
database.insertProduct = function (product, callback) {
  this.getConnection(function (db) {
    const insertQuery = productSQL.insert;
    db.run(insertQuery,
      [product.id,
        product.name,
        product.price,
        product.description,
        product.businessID],
      callback);
  });
};

database.getAllBusinessProducts = function (businessID, callback) {
  this.getConnection(function (db) {
    const sqlQuery = productSQL.getAllBusinessProducts;
    db.all(sqlQuery, [businessID], callback);
  });
};

database.getProduct = function (id, callback) {
  this.getConnection(function (db) {
    const sqlQuery = productSQL.getProduct;
    db.get(sqlQuery, [id], callback);
  })
};


/***********************
 *  PURCHASE
 ***********************/
database.insertPurchase = function (purchase, callback) {
  this.getConnection(function (db) {
    const insertQuery = purchaseSQL.insert;
    db.run(insertQuery,
      [purchase.id,
        purchase.productID,
        purchase.businessID,
        purchase.userID],
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