'use strict';

/**
 * This module sole purpose is to provide a generic
 * interface to the underlying database being used by
 * the application.
 * */


var sqlite3DB = require('./sqlite3/sqlite3DB');
const dbManager = exports;

// TODO: Provide better error callbacks to caller.

/**
 * Inserts a User object into the database.
 * */
dbManager.insertUser = function (user, callback) {
  sqlite3DB.insertUser(user, callback);
};



dbManager.getAllUsers = function (callback) {
  sqlite3DB.getAllUsers(callback);
};

dbManager.getUser = function (email, callback) {
  sqlite3DB.getUser(email, callback);
};

dbManager.insertBusiness = function (business, callback) {
  sqlite3DB.insertBusiness(business, callback);
};

dbManager.getAllBusiness = function (callback) {
  sqlite3DB.getAllBusiness(callback);
};


dbManager.insertProduct = function (product, callback) {
  sqlite3DB.insertProduct(product, callback);
};


dbManager.getAllBusinessProducts = function (businessID, callback) {
  sqlite3DB.getAllBusinessProducts(businessID, callback);
};

dbManager.getProduct = function (productID, callback) {
  sqlite3DB.getProduct(productID, callback);
};


dbManager.insertPurchase = function (purchase, callback) {
  sqlite3DB.insertPurchase(purchase, callback);
};





