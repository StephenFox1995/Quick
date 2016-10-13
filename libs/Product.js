'use strict';

var 
  BusinessObject  = require('../libs/BusinessObject'),
  mongoose        = require('mongoose'),
  models          = require('../models/mongoose/models')(mongoose);



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


module.exports = Product;