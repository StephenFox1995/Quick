'use strict';

const dbManager = require('./dbManager');
const database = exports;


/**
 * Inserts a User into the database.
 * @param user The user to add to the database.
 * @param callback Callback function.
 **/
database.insertUser = function (user, callback) {
  dbManager.insertUser(user, callback);
};

database.getUser = function (email, callback) {
  dbManager.getUser(email, callback);
};

database.getAllUsers = function (callback) {
  dbManager.getAllUsers(callback);
};

database.getClient = function (clientID, clientSecret, callback) {
  dbManager.getClient(clientID, clientSecret, callback);
};

/**
 * Insert an Product into the database.
 * @param product The order to add to the database.
 * @param callback Callback function.
 * */
database.insertProduct = function (product, callback) {
  dbManager.insertProduct(product, callback);
};
database.getProduct = function(productID, callback) {
  dbManager.getProduct(productID, callback);
};
database.getAllBusinessProducts = function (businessID, callback) {
  dbManager.getAllBusinessProducts(businessID, callback);
};


/**
 * Inserts a Business into the database.
 * @param business The business to add to the database.
 * @param callback Callback function.
 **/
database.insertBusiness = function (business, callback) {
  dbManager.insertBusiness(business, callback);
};
database.getAllBusiness = function (callback) {
  dbManager.getAllBusiness(callback);
};


/**
 * Inserts a Purchase into the database.
 * @param purchase The purchase details to
 *                 add to the database.
 * @param callback The callback function.
 * */
database.insertPurchase = function (purchase, callback) {
  dbManager.insertPurchase(purchase, callback);
};
