'use strict';

var util = require('./util'),
    db = require('../models/database');

function Purchase() { }

Purchase.prototype.parsePOST = function (req, callback) {
  var purchase = req.body.purchase;

  // Get user details from token.
  var token = req.decoded;
  this.userID = token.id;

  if (isValidPurchaseObject(purchase)) {
    this.businessID = purchase.businessID;
    this.productID = purchase.productID;
    callback(null);
  } else {
    callback(new Error('Could not parse Purchase.'));
  }
};


Purchase.prototype.insert = function (callback) {
  db.insertPurchase(this, callback);
};


function isValidPurchaseObject(purchase) {
  if (util.isValidString(purchase.businessID) &&
      util.isValidString(purchase.productID)) {
    return true;
  } else {
    return false;
  }
}

module.exports = Purchase;