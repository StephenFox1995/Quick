var 
  BusinessObject  = require('../libs/BusinessObject'),
  mongoose        = require('mongoose'),
  models          = require('../models/mongoose/models')(mongoose);



function Product() {}

Product.prototype = new BusinessObject();
Product.prototype.constructor = Product;
Product.prototype.schema = models.Product;


/**
 * Inserts a product into the database.
 * @param {function(err)} cb - Callback function.
 */
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

/**
 * Gets a product in the database.
 * @param {string} id - The id of the product.
 * @param {function(err, product)} - Callback function.
 */
Product.prototype.get = function(id, cb) {
  this.schema.findOne({_id: id}, cb);
};


/**
 * Removes a product from the database.
 * @param {function(err)} cb - Callback function.
 */
Product.prototype.remove = function(cb) {
  this.schema.remove({_id: this.id}, cb);
};


/**
 * Gets all products for a business.
 * @param {string} businessID - The id of the business.
 * @param {function(err, products)} cb - Callback function.
 */
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

/**
 * Updates a product in the database.
 * @param {array} updateFields - An array of all fields to update.
 * @param {function(err)} cb - Callback function.
 */
Product.prototype.update = function (updateFields, cb) {
  this.schema.findById(this.id, function(err, product) {
    // Assign all the new update fields to product and save.
    for (var i = 0; i < updateFields.length; i++) {
      product[updateFields[i].column] = updateFields[i].newValue;
    }
    product.save(cb);
  });
};

module.exports = Product;
