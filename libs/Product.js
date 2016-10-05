'use strict';

var 
  db              = require('../models/database'),
  BusinessObject  = require('../libs/BusinessObject'),
  mongoose        = require('mongoose'),
  models          = require('../models/mongoose/models')(mongoose);




function Product() {}

Product.prototype = new BusinessObject();
Product.prototype.constructor = Product;

Product.prototype.schema = models.Product;


Product.prototype.parsePOST = function (req, cb) {
  if (this.validRequest(req)) {
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


Product.prototype.insert = function (cb) {
  this.options = JSON.parse(this.options);
  var product = new this.schema({
    specifiedID: this.specifiedID,
    businessID: this.businessID,
    name: this.name,
    price: this.price,
    description: this.description,
    options: this.options,
  });
  // Save the product.
  product.save(function(err, product) {
    if (product) {
      product.id = product._id.toHexString();
    }
    return cb(err);
  });

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
  if ('options' in product) {
    // Only if the options array has an element
    // will we set it on this.
    if (product.options.length > 0) {
      this.options = product.options;
    }
  }
};


/**
 * Check that the request is valid.
 * @param {object} req - The request.
 * @return {boolean} True - Valid, else: false.
 */
Product.prototype.validRequest = function (req) {
  if (!this.requestContainsObjects(['product'], req)) {
    return false;
  }
  var product = req.body.product;

  return this.validStrings([    
    product.name,
    product.price,
    product.description,
    product.businessID]);
};

module.exports = Product;