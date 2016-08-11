'use strict';

var util = require('./util'),
    db = require('../models/database');


function Product() { }

Product.prototype.parsePOST = function (req, callback) {
  var product = req.body.product;
  
  if (isValidOrdersObject(product)) {
    this.name = product.name;
    this.price = product.price;
    this.description = product.description;
    this.businessID = product.businessID;
    callback(null);
  } else {
    callback(new Error('Could not parse Product.'));
  }
};



Product.prototype.insert = function (callback) {
  db.insertProduct(this, callback);
};

/**
 * Determines that the Order object is valid
 * by checking that all fields have a value.
 **/
function isValidOrdersObject(product) {
  if (util.isValidString(product.name) &&
      util.isValidString(product.price) &&
      util.isValidString(product.description) &&
      util.isValidString(product.businessID)) {
    return true;
  } else {
    return false;
  }
}

module.exports = Product;