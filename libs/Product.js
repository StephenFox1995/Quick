'use strict';

var 
  util = require('./util'),
  db = require('../models/database'),
  BusinessObject = require('../libs/BusinessObject');


Product.prototype = new BusinessObject();
Product.prototype.constructor = Product;


function Product() {
}


Product.prototype.parsePOST = function (req, cb) {
  if (validRequest(req)) {
    this.setAttributesFromRequest(req);
    return cb(null);
  } else {
    return cb(new Error('Could not parse product.'));
  }
};


Product.prototype.insert = function (callback) {
  // Set the creation time before inserting into the database.
  this.setCreationTime();
  db.insertProduct(this, callback);
};


Product.prototype.setAttributesFromRequest = function(req) {
  var product = req.body.product;
  this.name = product.name;
  this.price = product.price;
  this.description = product.description;
  this.businessID = product.businessID;
};


function validRequest(req) {
  if (!('product' in req.body)) {
    return false;
  }
  var product = req.body.product;
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