'use strict';

var 
  util        = require('./util'),
  parser      = require('./requestParser'),
  errors      = require('./errors'),
  tk          = require('./token'),
  Business    = require('./Business'),
  hash      = require('./hash');

var controller = module.exports;

// Expected requests.
var expectedRequests = {
  POST: {
    email: util.isValidString,
    password: util.isValidString,
    name: util.isValidString,
    address: util.isValidString,
    contactNumber: util.isValidString
  }
};

/**
 * Handles a POST request on the /business endpoint.
 * 
 * @param {req} req - The request.
 * @param {function(err, token)} cb - Callback function.
 */
controller.handlePost = function(req, cb) {
  var business = req.body.business || null;
  if (!business) {
    return cb(errors.noObjectFound('business'));
  }
  
  // Check valid request.
  parser.validProperties(expectedRequests.POST, business, function(err) {
    if (err) {
      return cb(errors.invalidProperties(err.invalidProperty));
    }

    var b = new Business();
    b.email = business.name;
    b.password = hash.hashPassword(business.password).hash; // hash password
    b.name = business.name;
    b.address = business.address;
    b.contactNumber = business.contactNumber;

    b.insert(function(err) {
      if (err) {
        return cb(errors.serverError());
      }
      // Delete password so not attached to token.
      delete b.password;
      // Genearate and pass token.
      var token = tk.generateToken(b);
      return cb(null, token);
    });
  });
};

