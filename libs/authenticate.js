var token     = require('../libs/token'),
    User      = require('../libs/User'),
    Business  = require('../libs/Business');

var auth = exports;
auth.auth = function(authType, req, cb) {
  authType = authType.toLowerCase();
  if (authType === 'user') {
    authUser(req, cb);
  } else if (authType === 'business') {
    authBusiness(req, cb);
  } else {
    cb(new Error('No auth type specified.'))
  }
};


function authUser(req, cb) {
  var email = req.body.user.email;
  var password = req.body.user.password;

  if (!email) {
    return cb(new Error('No email specified in the request.'))
  }
  if (!password) {
    return cb(new Error('No password specified in the request.'))
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
      return cb(new Error('Invalid Credentials'));
    }
  })
}


function authBusiness(req, cb) {
  var email = req.body.business.email;
  var password = req.body.business.password;

  if (!email) {
    return cb(new Error('No email specified in the request.'))
  }
  if (!password) {
    return cb(new Error('No password specified in the request.'))
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
      return cb(new Error('Invalid Credentials'));
    }
  })
}
