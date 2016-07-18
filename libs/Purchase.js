'use strict';

var util = require('./util'),
    db = require('../models/database');

function Purchase() { }

Purchase.prototype.parsePOST = function (req, callback) {
  var purchase = req.body;

  if (isValidPurchaseObject(purchase)) {
    this.businessID = purchase.businessID;
    this.userID = purchase.userID;
    this.productID = purchase.productID;
    callback(null);
  } else {
    callback(new Error('Could not parse Order.'));
  }
};


Purchase.prototype.insert = function (callback) {
  db.insertPurchase(this, callback);
};


function isValidPurchaseObject(purchase) {
  if (util.isValidString(purchase.businessID) &&
      util.isValidString(purchase.productID) &&
      util.isValidString(purchase.userID)) {
    return true;
  } else {
    return false;
  }
}

module.exports = Purchase;