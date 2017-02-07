'use strict';

var 
  util        = require('../util'),
  parser      = require('../requestParser'),
  errors      = require('../errors'),
  Order       = require('../Order');



var controller = module.exports;


var expectedRequests = {
  POST: {
    cost: util.isNumber,
    businessID: util.isValidString,
    coordinates: util.isObject
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

  // Check that there is the appropriate properties in order.
  parser.validProperties(expectedRequests.POST, order, function(err) {
    if (err) {
      return cb(errors.invalidProperties(err.invalidProperty));
    }

    var o = new Order();
    o.userID      = userID;
    o.businessID  = order.businessID;
    o.coordinates = order.coordinates;
    o.cost  = order.cost;
    o.status = 'unprocessed';
    o.processing = 700

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
  var reqData = null;
  try {
    reqData = controller.processRequestData(req);
  } catch (e) {
    return cb(e.message)
  }

  // Client could be a user or business.
  var order = new Order();
  order.get(reqData, function(err, orders) {
    if (err) {
      return cb(errors.serverError());
    }
    return cb(null, orders);
  });
};


controller.processRequestData = function(req) {
  var clientID = req.decoded.id || null;
  if (!clientID) {
    throw(new Error(errors.notAuthorized()));
  }
  var clientType = req.decoded.clientType || null;
  if (!clientType) {
    throw(new Error(errors.notAuthorized()));
  }
  return { clientID: clientID, clientType, clientType };
}