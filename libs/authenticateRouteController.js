'use strict';


var 
  util        = require('./util'),
  parser      = require('./requestParser'),
  errors      = require('./errors'),
  User        = require('./User'),
  Business    = require('./Business'),
  tk          = require('./token');

var controller = module.exports;

// Expected requests.
var expectedRequests = {
  AUTH_TYPE_POST: {
    authType: util.isValidString
  },
  AUTH_USER_POST: {
    email: util.isValidString,
    password: util.isValidString
  },
  AUTH_BUSINESS_POST: {
    email: util.isValidString,
    password: util.isValidString
  }
};

/**
 * Handles a POST request on the /auth endpoint.
 * @param {object} req - The request.
 * @param {function(err, token)} cb - Callback function.
 */
controller.handlePost = function(req, cb) {
  // Ensure body has valid properties.
  parser.validProperties(expectedRequests.AUTH_TYPE_POST, req.body, function(err) {
    if (err) {
      return cb(errors.invalidProperties('authType'));
    }
    var authType = req.body.authType.toLowerCase();
    if (authType === 'user') {
      return authUser(req, cb);
    } else if (authType === 'business') {
      return authBusiness(req, cb);
    } else {
      return cb(errors.invalidProperties('authType'));
    }
  });
};

/**
 * Attempts to authenticate a user
 * by checking the users email and password
 * against hashed version on the database.
 * @param   {object} req - The request object.
 * @param   {function(err, token)} cb - Callback function.
 * @return  {undefined} 
 * */
function authUser(req, cb) {
  var user = req.body.user || null;
  if (!user) {
    return cb(errors.noObjectFound('user'));
  }

  // Check that user has email, password.
  parser.validProperties(expectedRequests.AUTH_USER_POST, user, function(err) {
    if (err) {
      return cb(errors.invalidProperties(err.invalidProperty));
    }

    var u = new User();
    u.email = user.email;
    u.password = user.password;
    // Ensure password is correct.
    u.verify(function(err, verified) {
      // Remove password before token generation.
      delete u.password;

      if (err) {
        return (errors.serverError());
      }
      if (verified) {
        var token = tk.generateToken(u);
        return cb(null, token);
      } else {
        return cb(errors.notAuthorized());
      }
    });
  });
};


/**
 * Attempts to authenticate a business
 * by checking the users email and password
 * against hashed version on the database.
 * @param   {Object} req The request object.
 * @param   {function(err,token)} cb Callback
 * @return  {undefined}
 * */
function authBusiness(req, cb) {
  var business = req.body.business || null;
  if (!business) {
    return cb(errors.noObjectFound('business'));
  }

  // Check that user has email, password.
  parser.validProperties(expectedRequests.AUTH_USER_POST, business, function(err) {
    if (err) {
      return cb(errors.invalidProperties(err.invalidProperty));
    }

    var b = new Business();
    b.email = business.email;
    b.password = business.password;
    // Ensure password is correct.
    b.verify(function(err, verified) {
      // Remove password before token generation.
      delete b.password;

      if (err) {
        return cb(errors.serverError());
      }
      if (verified) {
        var token = tk.generateToken(b);
        return cb(null, token);
      } else {
        return cb(errors.notAuthorized());
      }
    });
  });
}