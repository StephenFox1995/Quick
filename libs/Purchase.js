'use strict';

const util = require('./util');
const db = require('../models/database');

function Purchase() { }

Purchase.prototype.parsePOST = function (req, callback) {
  var purchase = req.body;

  if (isValidPurchaseObject(purchase)) {
    this.businessID = purchase.businessID;
    this.userID = purchase.userID;
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
      util.isValidString(purchase.userID)) {
    return true;
  } else {
    return false;
  }
}

module.exports = Purchase;