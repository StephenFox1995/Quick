'use strict';


var express   = require('express'),
    User      = require('../libs/User'),
    httpCodes = require('../libs/httpCodes'),
    token     = require('../libs/token'),
    Business  = require('../libs/Business');


var router = express.Router();


/**
 * To authenticate we must execute the code flow.
 * 1. Parse and verify the POST request.
 * 2. Check the user's email exists in the sqlite3DB.
 * 3. If the user's email exists, get the password.
 * 4. Compare the password sent in the POST request
 *    with the hashed password from the sqlite3DB.
 * 5. Send response based on the comparison of these passwords.
 *
 *  The post request should include the user as follows.
 *
 * {"
 *
 *  user": {
 *    "email": "something@something.com",
 *    "password": "somepassword"
 *  }
 * }
 *
 * A successful login attempt will return HTTP Code 200.
 * A failed login attempt will return a HTTP Code 400.
 *
 *
 * */
router.post('/', function (req, res) {
  // Get the auth type.
  var authType = req.body.authType;

  if (authType.toLowerCase() === 'user') {
    return userAuth(req, res);
  }
  else if (authType.toLowerCase() === 'business') {
    return businessAuth(req, res);
  }
  else { /*Return error*/ }

  var email = req.body.user.email;
  var password = req.body.user.password;

  var user = new User();
  user.email = email;
  user.password = password;

  user.verify(function (err, verified) {
    delete user.email;
    delete user.password;
    
    if (err) {
      return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ responseMessage: "A server error occurred" });
    }
    if (verified) {
      var t = token.generateToken(user);

      return res.status(httpCodes.SUCCESS).json({
        responseMessage: "Login Successful.",
        success: true,
        token: t
      });
    } else {
      return res.status(httpCodes.BAD_REQUEST).json({responseMessage: "Login Failed - Invalid Credentials"});
    }
  });
});


/***
 * Log in a user account.
 * @param req
 * @param res
 */
function userAuth(req, res) {
  var email = req.body.user.email;
  var password = req.body.user.password;

  if (!email || !password) { return 'error' }

  var user = new User();
  user.email = email;
  user.password = password;
  
  user.verify(function (err, verified) {
    delete user.email;
    delete user.password;

    if (err) {
      return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ responseMessage: "A server error occurred" });
    }
    if (verified) {
      var t = token.generateToken(user);
      return res.status(httpCodes.SUCCESS).json({
        responseMessage: "Login Successful.",
        success: true,
        token: t
      });
    } else {
      return res.status(httpCodes.BAD_REQUEST).json({responseMessage: "Login Failed - Invalid Credentials"});
    }
  });

}

/**
 * Log in a business account.
 * @param req
 * @param res
 */
function businessAuth(req, res) {
  var email = req.body.business.email;
  var password = req.body.business.password;

  if (!email || !password) { return 'error'; }

  var business = new Business();
  business.email = email;
  business.password = password;
  business.verify(function (err, verified) {
    delete business.password;
    delete business.email;

    if (verified) {
      var t = token.generateToken(business);
      return res.status(httpCodes.SUCCESS).json({
        responseMessage: "Login Successful.",
        success: true,
        token: t
      });
    } else {
      return res.status(httpCodes.BAD_REQUEST).json({responseMessage: "Login Failed - Invalid Credentials"});
    }
  })
}




module.exports = router;