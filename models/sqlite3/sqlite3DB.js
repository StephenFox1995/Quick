'use strict';

var sqlite3 = require('sqlite3').verbose(),
    globals = require('../../libs/globals'),
    userSQL = require('./userSQL'),
    businessSQL = require('./businessSQL'),
    productSQL = require('./productSQL'),
    purchaseSQL = require('./purchaseSQL'),
    oauthSQL = require('./oauthSQL');


const sqlite3DB = exports;

/**
 * Database object shared by module.
 **/
var db;


/***********************
 *  USER
 ***********************/

/**
 * Inserts a User into the sqlite3 sqlite3DB.
 * @param user The user to add to the sqlite3DB.
 * @param callback Callback function.
 **/
sqlite3DB.insertUser = function (user, callback) {
  this.getConnection(function (db) {
    const insertQuery = userSQL.insert;
    // Insert user into sqlite3DB.
    db.run(insertQuery,
      [user.id,
        user.firstname,
        user.lastname,
        user.email,
        user.password,
        user.token,
        user.email],
      callback);
  });
};

sqlite3DB.getAllUsers = function (callback) {
  this.getConnection(function (db) {
    const sqlQuery = userSQL.all;
    db.all(sqlQuery, callback);
  });
};

sqlite3DB.getUser = function (email, callback) {
  this.getConnection(function (db) {
    const sqlQuery = oauthSQL.getUser;
    db.get(sqlQuery, [email], callback);
  });
};

sqlite3DB.getUserInfo = function (id, callback) {
  this.getConnection(function (db) {
    const sqlQuery = userSQL.getUserInfo;
    db.get(sqlQuery, [id], callback);
  });
};


/***********************
 *  BUSINESS
 ***********************/

/**
 * Inserts a Business into the sqlite3DB.
 * @param business The business to add to the sqlite3DB.
 * @param callback Callback function.
 **/
sqlite3DB.insertBusiness = function (business, callback) {
  this.getConnection(function (db) {
    const insertQuery = businessSQL.insert;
    // Insert business into sqlite3DB.
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

sqlite3DB.getAllBusiness = function (callback) {
  this.getConnection(function (db) {
    const sqlQuery = businessSQL.all;
    db.all(sqlQuery, callback);
  });
};

sqlite3DB.getBusiness = function (email, callback) {
  this.getConnection(function (db) {
    const sqlQuery = businessSQL.getBusiness;
    db.get(sqlQuery, [email], callback);
  });
};



sqlite3DB.getBusinessInfo = function (id, callback) {
  this.getConnection(function (db) {
    const sqlQuery = businessSQL.info;
    db.get(sqlQuery, [id], callback);
  });
};


/***********************
 *  PRODUCT
 ***********************/

/**
 * Insert an Product into the sqlite3DB.
 * @param product The order to add to the sqlite3DB.
 * @param callback Callback function.
 * */
sqlite3DB.insertProduct = function (product, callback) {
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

sqlite3DB.getAllBusinessProducts = function (businessID, callback) {
  this.getConnection(function (db) {
    const sqlQuery = productSQL.getAllBusinessProducts;
    db.all(sqlQuery, [businessID], callback);
  });
};

sqlite3DB.getProduct = function (id, callback) {
  this.getConnection(function (db) {
    const sqlQuery = productSQL.getProduct;
    db.get(sqlQuery, [id], callback);
  })
};


/***********************
 *  PURCHASE
 ***********************/
sqlite3DB.insertPurchase = function (purchase, callback) {
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
 * Get a connection to the sqlite3DB file stored on disk.
 **/
sqlite3DB.getConnection = function (callback) {
  // Check to see if connection to sqlite3DB already exists.
  if (db) {
    callback(db);
  } else {
    db = new sqlite3.Database(globals.Globals.dbLocation);
    callback(db);
  }
};