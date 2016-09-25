'use strict';

var 
  sqlite3 = require('sqlite3').verbose(),
  globals = require('../../libs/globals'),
  userSQL = require('./userSQL'),
  businessSQL = require('./businessSQL'),
  productSQL = require('./productSQL'),
  purchaseSQL = require('./purchaseSQL'),
  oauthSQL = require('./oauthSQL');


const sqlite3DB = exports;




/***********************
 *  USER
 ***********************/

/**
 * Inserts a User into the database.
 * @param   {User} user - The user to add to the database.
 * @param   {function()} callback - Callback function.
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
sqlite3DB.getBusinessPurchases = function (id, callback) {
  this.getConnection(function (db) {
    const sqlQuery = businessSQL.getPurchases;
    db.all(sqlQuery, [id], callback);
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
        product.specifiedID,
        product.name,
        product.price,
        product.description,
        product.businessID,
        product.options,
        product.timestamp],
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
  });
};
sqlite3DB.updateProduct = function(productID, updateFields, callback) {
  this.getConnection(function (db) {
    // Generate a dynamic query for the update.
    const sqlQuery = productSQL.generateUpdateQueryString(productID, updateFields);

    var queryArguments = [];
    // Parse all the values for update.
    updateFields.forEach(function(field, index) {
      queryArguments.push(field.newValue);
    });

    // Add productID so database knows what row to update. 
    queryArguments.push(productID);
    
    // Now run the query.
    return db.run(sqlQuery, queryArguments, callback); 
  });
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


sqlite3DB.getUserPurchases = function (userID, callback) {
  this.getConnection(function (db) {
    const sqlQuery = purchaseSQL.userPurchases;
    db.all(sqlQuery, [userID],  callback);
  });
};


/**
 * Database object shared by module.
 **/
var db;

/**
 * Get a connection to the database file stored on disk.
 */
sqlite3DB.getConnection = function (callback) {
  // Check to see if connection to database already exists.
  if (db) {
    callback(db);
  } else {
    db = new sqlite3.Database(globals.Globals.dbLocation);
    callback(db);
  }
};

/**
 * Creates an SQLite database on the host system.
 * @param   {string} location - The location to create the database. 
 */
sqlite3DB.create = function(location) {
  var sqlite3 = require('sqlite3').verbose();
  var db = new sqlite3.Database(location);
  db.serialize(function () {
    // Create User table.
    db.run(userSQL.create);
    db.run(businessSQL.create);
    db.run(productSQL.create);
    db.run(purchaseSQL.create);
  });
};