'use strict';

var 
  dbManager = require('./dbManager'),
  fs        = require('fs'),
  globals   = require('../libs/globals');

const database = exports;


/**
 * Inserts a User into the database.
 * @param   {User} user - The user to add to the sqlite3DB.
 * @param   {function(err)} cb - callback Callback function.
 **/
database.insertUser = function (user, cb) {
  dbManager.insertUser(user, cb);
};

database.getUser = function (email, callback) {
  dbManager.getUser(email, callback);
};

database.getUserInfo = function (id, callback) {
  dbManager.getUserInfo(id, callback);
};

database.getAllUsers = function (callback) {
  dbManager.getAllUsers(callback);
};
database.getUserPurchases = function (userID, callback) {
  dbManager.getUserPurchases(userID, callback);
};

database.getClient = function (clientID, clientSecret, callback) {
  dbManager.getClient(clientID, clientSecret, callback);
};

/**
 * Insert an Product into the sqlite3DB.
 * @param   {Product} product - product The order to add to the sqlite3DB.
 * @param   {function} cb - Callback function.
 * */
database.insertProduct = function (product, cb) {
  dbManager.insertProduct(product, cb);
};
database.getProduct = function(productID, callback) {
  dbManager.getProduct(productID, callback);
};
database.getAllBusinessProducts = function (businessID, callback) {
  dbManager.getAllBusinessProducts(businessID, callback);
};


/**
 * Inserts a Business into the sqlite3DB.
 * @param {Business} business - The business to add to the sqlite3DB.
 * @param {function} callback - Callback function.
 **/
database.insertBusiness = function (business, callback) {
  dbManager.insertBusiness(business, callback);
};
database.getAllBusiness = function (callback) {
  dbManager.getAllBusiness(callback);
};
database.getBusiness = function (email, callback) {
  dbManager.getBusiness(email, callback);
};
database.getBusinessInfo = function (id, callback) {
  dbManager.getBusinessInfo(id, callback);
};





/**
 * Inserts a Purchase into the sqlite3DB.
 * @param   {Purchase} purchase - The purchase details to add to the sqlite3DB.
 * @param   {function} callback - The callback function.
 * */
database.insertPurchase = function (purchase, callback) {
  dbManager.insertPurchase(purchase, callback);
};


database.locate = function () {
  var configFile;
  try {
    configFile = fs.readFileSync(globals.Globals.configFile, 'utf8');
  } catch (e) {
    if (e.code === 'ENOENT') {
      console.log('Could not find configurations file.');
      return false;
    }
  }
  // Parse the json for the db filepath.
  var dbLocation = JSON.parse(configFile);
  if (dbLocation) {
    // Set location of sqlite3DB at a global level.
    globals.Globals.dbLocation = dbLocation.sqliteFilepath;
    return true;
  } else {
    console.log('Configuration file does not contain location of sqlite3DB.');
    return false;
  }
};
