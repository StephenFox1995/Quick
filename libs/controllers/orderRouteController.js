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
};

function checkOrderPricing(order, cb) {
  // Get product from the database.
  var product = new Product();
  product.get(order.productID, function(err, product) {
    // Perform checking based on two scenarios:
    // -  the order has no product options associated with it.

    // -  the order has product options associated with it
    //    and therefore need to be calculated appropriately.
    if (err) {
      // No product exists with that id.
      return cb(errors.serverError());
    }

    var options;
    // The amount to increase the product price by, based on what options the
    // the user has chosen for the specified product.
    var priceDelta = 0;  
    var overallOrderPrice = 0;
    // Check that there are options.
    if (order.options.length > 0) {
      options = order.options;
      
      // Loop through all product options.
      for (var i = 0; i < options.length; i++) {
        var option = options[i];
        
        // Check that there are values for the current option.
        if (typeof option.values === undefined ||
            option.values.length <= 0) {
          continue; // Move to next iteration.
        }
        var values = option.values;
        // Loop through all values of the current options.
        for (var j = 0; j < values.length; j++) {
          priceDelta += values[i].priceDelta;
        }
      }
      // TODO: Make sure order price delta options are same as recorded on disk.
    } else {
      // Just make sure that the price of the product
      // is what is in the database.
      // This ensures no errors on the client side slip through.
      if (order.price === product.price) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    }
  });
}