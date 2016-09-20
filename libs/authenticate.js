var 
  token     = require('../libs/token'),
  User      = require('../libs/User'),
  Business  = require('../libs/Business');

var auth = exports;
/** 
 * Authenticates a user or business.
 * @param {String} authType The authentication type.
 * @param {Object} req The request object.
 * @param {function(err, cb)} cb Callback function
 * */
auth.auth = function(authType, req, cb) {
  authType = authType.toLowerCase();
  if (authType === 'user') {
    authUser(req, cb);
  } else if (authType === 'business') {
    authBusiness(req, cb);
  } else {
    cb(new Error('No auth type specified.'));
  }
};



/**
 * Attempts to authenticate a user
 * by checking the users email and password
 * against hashed version on the database.
 * @param   {object} req - The request object.
 * @param   {function(err,s)} cb - Callback function.
 * @return  {undefined} 
 * */
function authUser(req, cb) {
  if (!('user' in req.body)) {
    return cb(new Error('No user found in request.'));
  }
  var email = req.body.user.email;
  var password = req.body.user.password;
  
  if (!email) {
    return cb(new Error('No email specified in the request.'));
  }
  if (!password) {
    return cb(new Error('No password specified in the request.'));
  }

  var user = new User();
  user.email = email;
  user.password = password;

  // Verify the user.
  user.verify(function (err, verified) {
    // remove password before token generation.
    delete user.password;

    if (err) {
      return cb(err);
    }
    if (verified) {
      var tk = token.generateToken(user);
      return cb(null, tk);
    } else {
      return cb(new Error('Invalid username or password.'));
    }
  });
}

/**
 * Attempts to authenticate a business
 * by checking the users email and password
 * against hashed version on the database.
 * @param   {Object} req The request object.
 * @param   {function(err,token)} cb Callback
 * @return  {undefined}
 * */
function authBusiness(req, cb) {
  var email = req.body.business.email;
  var password = req.body.business.password;

  if (!email) {
    return cb(new Error('No email specified in the request.'));
  }
  if (!password) {
    return cb(new Error('No password specified in the request.'));
  }

  var business = new Business();
  business.email = email;
  business.password = password;

  // Verify the business.
  business.verify(function (err, verified) {
    // remove password before token generation.
    delete business.password;

    if (err) {
      return cb(err);
    }
    if (verified) {
      var tk = token.generateToken(business);
      return cb(null, tk);
    } else {
      return cb(new Error('Invalid username or password.'));
    }
  });
}
