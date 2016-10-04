'use strict';

var 
  dbManager = require('./dbManager'),
  fs        = require('fs'),
  globals   = require('../libs/globals'),
  mongoose  = require('mongoose');

var database = exports;

/**
 * Inserts a User into the database.
 * @param   {User} user - The user to add to the database.
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
 * Insert an Product into the datase.
 * @param   {Product} product - product The order to add to the database..
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
database.updateProduct = function(productID, updateFields, callback) {
  dbManager.updateProduct(productID, updateFields, callback);
};


/**
 * Inserts a Business into the database.
 * @param {Business} business - The business to add to the database.
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
database.getBusinessPurchases = function(id, callback) {
  dbManager.getBusinessPurchases(id, callback);
};



/**
 * Inserts a Purchase into the database.
 * @param   {Purchase} purchase - The purchase details to add to the database.
 * @param   {function} callback - The callback function.
 * */
database.insertPurchase = function (purchase, callback) {
  dbManager.insertPurchase(purchase, callback);
};



database.setupMongo = function(callback) {
  var configFileContents;
  try {
    configFileContents = fs.readFileSync(globals.Globals.configFile, 'utf8');
  } catch (e) {
    if (e.code === 'ENOENT') {
      console.log('Could not find configurations file.');
      return false;
    }
  }

  // Get the Mongo details.
  var mongoDetails = JSON.parse(configFileContents).mongodb;
  if (mongoDetails) {
    globals.Globals.mongoDetails = {};
    globals.Globals.mongoDetails.port = mongoDetails.port;
    globals.Globals.mongoDetails.uri = mongoDetails.uri;
    globals.Globals.mongoDetails.database = mongoDetails.database;

    // Create Mongo url from config file.
    var url = 'mongodb://' + mongoDetails.uri + ':' + mongoDetails.port + '/' + mongoDetails.database;
    mongoose.connect(url);

    // CONNECTION EVENTS
    // When successfully connected
    mongoose.connection.on('connected', function () {  
      console.log('Mongoose default connection open to ' + url);
      callback(null);
    }); 

    // If the connection throws an error
    mongoose.connection.on('error', function (err) {  
      console.log('Mongoose default connection error: ' + err);
      callback(err);
    }); 

    // When the connection is disconnected
    mongoose.connection.on('disconnected', function () {  
      console.log('Mongoose default connection disconnected'); 
    });
  } else {
    console.log('Configuration file does not contain MongoDB details.');
    return false;
  }
};


