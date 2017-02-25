const BusinessObject = require('../libs/BusinessObject');
const mongoose = require('mongoose');
const models = require('../models/mongoose/models')(mongoose);



function Product() {}

Product.prototype = new BusinessObject();
Product.prototype.constructor = Product;
Product.prototype.Schema = models.Product;


/**
 * Inserts a product into the database.
 * @param {function(err)} cb - Callback function.
 */
Product.prototype.insert = function (cb) {
  const product = new this.Schema({
    specifiedID: this.specifiedID,
    businessID: this.businessID,
    name: this.name,
    price: this.price,
    description: this.description,
    options: this.options,
    processing: this.processing,
  });
  // Save the product.
  product.save(err => cb(err));
};

/**
 * Gets a product in the database.
 * @param {string} id - The id of the product.
 * @param {function(err, product)} - Callback function.
 */
Product.prototype.get = function get(id, cb) {
  this.Schema.findOne({ _id: id }, cb);
};


/**
 * Removes a product from the database.
 * @param {function(err)} cb - Callback function.
 */
Product.prototype.remove = function remove(cb) {
  this.Schema.remove({ _id: this.id }, cb);
};


/**
 * Gets all products for a business.
 * @param {string} businessID - The id of the business.
 * @param {function(err, products)} cb - Callback function.
 */
Product.prototype.getAllProductsForBusiness = function(businessID, cb) {
  this.Schema.aggregate([{
    $match: {
      businessID: new mongoose.Types.ObjectId(businessID),
    },
  },
  {
    $project: {
      id: '$_id',
      _id: 1,
      businessID: 1,
      processing: 1,
      specifiedID: 1,
      name: 1,
      price: 1,
      description: 1,
      options: 1,
      createdAt: 1,
    },
  }], cb);
};

/**
 * Updates a product in the database.
 * @param {array} updateFields - An array of all fields to update.
 * @param {function(err)} cb - Callback function.
 */
Product.prototype.update = function (updateFields, cb) {
  this.Schema.findById(this.id, function(err, product) {
    // Assign all the new update fields to product and save.
    for (var i = 0; i < updateFields.length; i++) {
      product[updateFields[i].column] = updateFields[i].newValue;
    }
    product.save(cb);
  });
};

module.exports = Product;
