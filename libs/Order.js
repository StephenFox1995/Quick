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
    userID: this.userID,
    coordinates: this.coordinates,
    processing: this.processing,
    status: this.status
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
  let clientID = client.clientID;
  let clientType = client.clientType;
  var match = {};
  if (clientType === 'user') {
    match["userID"] = new mongoose.Types.ObjectId(clientID);
  } else if(clientType === 'business') {
    match["businessID"] = new mongoose.Types.ObjectId(clientID);
  } else {
    return cb(new Error('Unknown Client'));
  }
  // match.status = "unprocessed" // TODO: check what client wants

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