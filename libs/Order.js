'use strict';

var 
  util      = require('./util'),
  mongoose  = require('mongoose'),
  models    = require('../models/mongoose/models')(mongoose);


function Order() {}

Order.prototype.schema = models.Order;


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


Order.prototype.parsePOST = function(req, cb) {
  if (validRequest(req)) {
    this.setAttributesFromRequest(req);
    return cb(null);
  } else {
    return cb(new Error('Could not parse order request.'));
  }
};

Order.prototype.setAttributesFromRequest = function(req) {
  var order = req.body.order;
  this.businessID = order.businessID;
  this.productID = order.productID;

  // Get the userID from the token in the request;
  var token = req.decoded;
  this.userID = token.id;
};


function validRequest(req) {
  if (!('order') in req.body) {
    return false;
  }

  var order = req.body.order;
  if (util.isValidString(order.businessID) &&
      util.isValidString(order.productID)) {
    return true;
  } else {
    return false;
  }
}

module.exports = Order;