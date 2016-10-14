'use strict';

var 
  mongoose        = require('mongoose'),
  BusinessObject  = require('../libs/BusinessObject'),
  models          = require('../models/mongoose/models')(mongoose);
  

function Order() {}
Order.prototype = new BusinessObject();
Order.prototype.constructor = Order;
Order.prototype.schema = models.Order;

/**
 * Adds a new order to the database.
 * @param {function(err, orderID)} - Callback function.
 */
Order.prototype.insert = function(cb) {
  var order = new this.schema({
    businessID: this.businessID,
    productID: this.productID,
    userID: this.userID
  });

  // Add order to database.
  order.save(function(err, order) {
    var orderID = null;
    if (order) {
      orderID = order._id;
    }
    return cb(err, orderID);
  });
};  


/**
 * Retrieves all orders for a given client e.g. user, business.
 * @param {string} client - Either 'business' or 'user'
 * @param {function(err, orders)} cb - Callback function.
 */
Order.prototype.get = function(client, cb) {
  if (typeof client !== 'string') {
    return cb(new Error('Client must be string'));
  }
  
  var match = {};
  if (client === 'user') {
    // Create the match for pipeline using a users id.
    match["userID"] = new mongoose.Types.ObjectId(this.id);
  }
  else if(client === 'business') {
    // Create the match for pipeline using a business id.
    match["businessID"] = new mongoose.Types.ObjectId(this.id);
  } 
  else {
    // If neither client business or user, forward on error.
    return cb(new Error('Unknown Client'));
  }
  
  // TODO: if client is business remove $lookup for business in pipeline.
  this.schema.aggregate([
    { 
      $match: match
    },
    { 
      $lookup: {
        from: "products", 
        localField: "productID", 
        foreignField: "_id", 
        as: "product"
      },
    },
    { 
      $unwind: "$product" 
    },
    { 
      $lookup: {
        from: "businesses", 
        localField: "businessID", 
        foreignField: "_id", 
        as: "business"
      },
    },
    { 
      $unwind: "$business" 
    },
    { 
      $project: {
        id: "$_id",
        _id: 0,
        createdAt: 1,
        product: {
          id: "$_id",
          businessID: 1,
          specifiedID: 1,
          name: 1,
          price: 1,
          description: 1,
          options: 1,
          createdAt: 1,
        },
        business: {
          id: "$_id",
          name: 1,
          address: 1,
          contactNumber: 1,
          email: 1
        }
      },
    }
  ], cb);
};

module.exports = Order;