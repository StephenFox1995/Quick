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

/**
 * Parses a PATH HTTP request in JSON.
 * This method will attempt to retrieve all fields that the
 * request specifies for updating.
 * If no update fields are found, then an empty array will be returned.
 * Otherwise an array containing objects with the fields to be updated will be returned
 * in the following format of:
 *   [{fieldToUpdate: newValue},
 *    {fieldToUpdate: newValue}
 *   ] 
 * Along with the update fields, the id of the product to be updated must be included.
 * The id will be set with the instance of the product who invoked the method.
 * 
 * @param {req} req - The request object with the updated product details.
 * @return {array} - The parsed fields to update.
 */
Product.prototype.parsePATCH = function (req) {
  // Check for updatedProduct object in body.
  if (!("updatedProduct" in req.body)) {
    return [];
  }

  var product = req.body.updatedProduct;
  if ((!('id' in product)) || (!('updateFields' in product))) {
    return [];
  }

  // Set id for this instance.
  this.id = product.id;
  // Get the properties to update.
  return product.updateFields;
};


Product.prototype.insert = function (callback) {
  // Set the creation time before inserting into the database.
  this.setCreationTime();
  db.insertProduct(this, callback);
};

Product.prototype.update = function (updateFields, callback) {
  db.updateProduct(this.id, updateFields, callback);
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