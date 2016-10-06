'use strict';

var 
  util      = require('./util'),
  db        = require('../models/database'),
  User      = require('./User'),
  Business  = require('./Business');


  

function Purchase() { }


Purchase.prototype.parsePOST = function (req, callback) {
  if (validRequest(req)) {
    this.setAttributesFromRequest(req);
    return callback(null);
  } else {
    return callback(new Error('Could not parse purchase.'));
  }
};


Purchase.prototype.insert = function (callback) {
  db.insertPurchase(this, callback);
};

Purchase.prototype.setAttributesFromRequest = function(req) {
  var purchase = req.body.purchase;
  this.businessID = purchase.businessID;
  this.productID = purchase.productID;
  // Get token details
  var token = req.decoded;
  this.userID = token.id;
};



/**
 * Retrieves purchases from the database.
 * @param   {String} object - Either Business or User object.
 * @param   {function(err, purchases)} callback - The callback function.
 */
Purchase.prototype.getPurchases = function (object, callback) {
  if (object instanceof User) {
    return db.getUserPurchases(object.id, callback);
  } else if (object instanceof Business) {
    return db.getBusinessPurchases(object.id, callback);
  } else {
    return callback(new Error('Unrecognized prototype.'));
  }
};

function validRequest(req) {
  if (!('purchase' in req.body)) {
    return false;
  }
  var purchase = req.body.purchase;
  if (util.isValidString(purchase.businessID) &&
      util.isValidString(purchase.productID)) {
    return true;
  } else {
    return false;
  }
}




module.exports = Purchase;