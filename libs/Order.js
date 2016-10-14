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


module.exports = Order;