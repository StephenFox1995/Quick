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
    status: this.status,
    cost: this.cost
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
  match.status = "unprocessed" // TODO: check what client wants
  console.log(clientID)
  // TODO: if client is business remove $lookup for business in pipeline.
  this.schema.aggregate([{ $match: match }], cb);
};

Order.prototype.getByID = function(id, cb) {
  var match = { _id: id }
  this.schema.find({_id: id}, cb)
  // this.schema.aggregate([{ $match: match }], cb)
}


module.exports = Order;