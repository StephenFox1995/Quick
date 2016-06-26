'use strict';

const util = require('./util');
const  db = require('../models/database');


function Order() { }

Order.prototype.parsePOST = function (req, callback) {
  var order = req.body;
  
  if (isValidOrdersObject(order)) {
    this.name = order.name;
    this.price = order.price;
    this.description = order.description;
    this.businessID = order.businessID;
    callback(null);
  } else {
    callback(new Error('Could not parse Order.'));
  }
};



Order.prototype.insert = function (callback) {
  db.insertOrder(this, callback);
};

/**
 * Determines that the Order object is valid
 * by checking that all fields have a value.
 **/
function isValidOrdersObject(order) {
  if (util.isValidString(order.name) &&
      util.isValidString(order.price) &&
      util.isValidString(order.description) &&
      util.isValidString(order.businessID)) {
    return true;
  } else {
    return false;
  }
}

module.exports = Order;