'use strict';

var 
  util        = require('../util'),
  parser      = require('../requestParser'),
  errors      = require('../errors'),
  Order     = require('../Order');



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
  var userID = req.decoded || null;
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