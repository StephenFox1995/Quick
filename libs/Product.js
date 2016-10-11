'use strict';

var 
  BusinessObject  = require('../libs/BusinessObject'),
  mongoose        = require('mongoose'),
  models          = require('../models/mongoose/models')(mongoose),
  util            = require('../libs/util');



function Product() {}

Product.prototype = new BusinessObject();
Product.prototype.constructor = Product;

Product.prototype.schema = models.Product;





Product.prototype.insert = function (cb) {
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
    return cb(err);
  });
};


Product.prototype.remove = function(cb) {
  this.schema.remove({_id: this.id}, cb);
};


Product.prototype.getAllProductsForBusiness = function(businessID, cb) {
  this.schema.aggregate([{
    $match: {
      businessID: new mongoose.Types.ObjectId(businessID)
    }
  },
  { 
    $project: {
      id: "$_id",
      _id: 1,
      businessID: 1,
      specifiedID: 1,
      name: 1,
      price: 1,
      description: 1,
      options: 1,
      createdAt: 1,  
    }
  }], cb); 
};

Product.prototype.update = function (updateFields, callback) {
  this.schema.findById(this.id, function(err, product) {
    // Assign all the new update fields to product and save.
    for (var i = 0; i < updateFields.length; i++) {
      product[updateFields[i].column] = updateFields[i].newValue;
    }
    product.save(callback);
  });
};


Product.prototype.parsePOST = function (req, cb) {
  if (this.validRequest(req)) {
    this.setAttributesFromRequest(req);
    return cb(null);
  } else {
    return cb(new Error('Could not parse product.'));
  }
};

Product.prototype.setAttributesFromRequest = function(req) {
  var product = req.body.product;
  this.name = product.name;
  this.price = product.price;
  this.description = product.description;
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
    product.description]);
};

/**
 * Parses a PATH HTTP request in JSON.
 * This method will attempt to retrieve all fields that the
 * request specifies for updating.
 * If no update fields are found, then an empty array will be returned.
 * Otherwise an array containing objects with the fields to be updated will be returned
 * in the following format of:
 *   [{fieldToUpdate: newValue},
 *    {fieldToUpdate: newValue}] 
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


/**
 * Parses delete request for product.
 * @param {function(err)} cb - Callback function.
 */
Product.prototype.parseDelete = function(req, cb) {
  if (!('productID' in req.params)) {
    return cb('No product id found in reqest parameters.');
  }
  var productID = req.params.productID;

  // Check id is valid string.
  if (util.isValidString(productID)) {
    this.id = productID;
    return cb(null);
  } else {
    return cb(new Error('Unknown format for productID request parameters.'));
  }
  
};

module.exports = Product;