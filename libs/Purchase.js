'use strict';

var 
  util = require('./util'),
  db = require('../models/database');

function Purchase() { }

Purchase.prototype.parsePOST = function (req, callback) {
  // Get user details from token.
  var token = req.decoded;
  this.userID = token.id;
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
};

function validRequest(req) {
  if (!'purchase' in req.body) {
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