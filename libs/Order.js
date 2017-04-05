const mongoose = require('mongoose');
const BusinessObject = require('../libs/BusinessObject');
const models = require('../models/mongoose/models')(mongoose);


function Order() {}
Order.prototype = new BusinessObject();
Order.prototype.constructor = Order;
Order.prototype.Schema = models.Order;
Order.prototype.businessID = null;
Order.prototype.products = null;
Order.prototype.userID = null;
Order.prototype.coordinates = null;
Order.prototype.processing = null;
Order.prototype.status = null;
Order.prototype.cost = null;
Order.prototype.travelMode = null;
Order.prototype.release = null;
Order.prototype.deadline = null;
Order.prototype.finishTime = null;

/**
 * Adds a new order to the database.
 * @param {function(err, orderID)} - Callback function.
 */
Order.prototype.insert = function insert(cb) {
  const order = new this.Schema({
    businessID: this.businessID,
    products: this.products,
    userID: this.userID,
    coordinates: this.coordinates,
    processing: this.processing,
    status: this.status,
    cost: this.cost,
    travelMode: this.travelMode,
    release: null,
    deadline: null,
    finish: null,
  });
  // Add order to database.
  order.save((err, result) => cb(err, result._id));
};


/**
 * Retrieves all orders for a given client e.g. user, business.
 * @param {string} client - Either 'business' or 'user'
 * @param {function(err, orders)} cb - Callback function.
 */
Order.prototype.get = function get(client, cb) {
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

Order.prototype.getByID = function getByID(id, cb) {
  this.Schema.findOne({ _id: id }, cb);
};

/**
 * Sets the order status to processed.
 */
Order.prototype.finish = function finishOrder(id, cb) {
  this.Schema.update(
    { _id: id },
    { $set: { 
      status: 'processed',
      deadline: this.deadline,
      release: this.release,
      finish: this.finishTime,
    } }, cb);
};

module.exports = Order;
