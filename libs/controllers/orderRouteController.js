'use strict';

var 
  util        = require('../util'),
  parser      = require('../requestParser'),
  errors      = require('../errors'),
  Order       = require('../Order'),
  Product     = require('../Product');



var controller = module.exports;


var expectedRequests = {
  POST: {
    businessID: util.isValidString,
    productID: util.isValidString
  }
};

/**
 * Handles a POST request on the /order endpoint.
 * 
 * @param {req} req - The request.
 * @param {function(err, orderID)} cb - Callback function.
 */
controller.handlePost = function(req, cb) {
  // Grab the user id from the token.
  var userID = req.decoded.id || null;
  if (!userID) {
    return cb(errors.notAuthorized());
  }
  // Get the order from req body.
  var order = req.body.order || null;
  if (!order) {
    return cb(errors.noObjectFound('order'));
  }

  // Check that there is the appropriate properties in request.
  parser.validProperties(expectedRequests.POST, order, function(err) {
    if (err) {
      return cb(errors.invalidProperties(err.invalidProperty));
    }

    var o = new Order();
    o.userID = userID;
    o.businessID = order.businessID;
    o.productID = order.productID;

    // Insert the order to the database.
    o.insert(function(err, orderID) {
      if (err) {
        return cb(errors.serverError());
      }
      return cb(null, orderID);
    });
  });
};

/**
 * Handles a GET request on the /order endpoint.
 * 
 * @param {req} req - The request.
 * @param {function(err, orderID)} cb - Callback function.
 */
controller.handleGet = function(req, cb) {
  // Client could be a user or business.
  var clientID = req.decoded.id || null;
  if (!clientID) {
    return cb(errors.notAuthorized());
  }
  var clientType = req.decoded.clientType || null;
  if (!clientType) {
    return cb(errors.notAuthorized());
  }
  var order = new Order();
  order.id = clientID;
  order.get(clientType, function(err, orders) {
    if (err) {
      return cb(errors.serverError());
    }
    return cb(null, orders);
  });
}
