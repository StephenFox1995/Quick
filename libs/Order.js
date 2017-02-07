const mongoose = require('mongoose');
const BusinessObject = require('../libs/BusinessObject');
const models = require('../models/mongoose/models')(mongoose);

function Order() {}
Order.prototype = new BusinessObject();
Order.prototype.constructor = Order;
Order.prototype.Schema = models.Order;

/**
 * Adds a new order to the database.
 * @param {function(err, orderID)} - Callback function.
 */
Order.prototype.insert = (cb) => {
  const order = new this.Schema({
    businessID: this.businessID,
    productID: this.productID,
    userID: this.userID,
    coordinates: this.coordinates,
    processing: this.processing,
    status: this.status,
    cost: this.cost,
  });

  // Add order to database.
  order.save((err, result) => cb(err, result._id));
};


/**
 * Retrieves all orders for a given client e.g. user, business.
 * @param {string} client - Either 'business' or 'user'
 * @param {function(err, orders)} cb - Callback function.
 */
Order.prototype.get = (client, cb) => {
  const clientID = client.clientID;
  const clientType = client.clientType;
  const match = {};
  if (clientType === 'user') {
    match.userID = new mongoose.Types.ObjectId(clientID);
  } else if (clientType === 'business') {
    match.businessID = new mongoose.Types.ObjectId(clientID);
  } else {
    return cb(new Error('Unknown Client'));
  }
  match.status = 'unprocessed'; // TODO: check what client wants
  // TODO: if client is business remove $lookup for business in pipeline.
  return this.Schema.aggregate([{ $match: match }], cb);
};

Order.prototype.getByID = (id, cb) => {
  this.Schema.findOne({ _id: id }, cb);
  // this.Schema.aggregate([{ $match: match }], cb)
};

module.exports = Order;
