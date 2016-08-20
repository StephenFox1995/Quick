'use strict';


var express   = require('express'),
    User      = require('../libs/User'),
    httpCodes = require('../libs/httpCodes'),
    token     = require('../libs/token'),
    Business  = require('../libs/Business');


var router = express.Router();


/**
 * The app can authenticate two types of clients;
 * users and businesses. To distinguish between the two
 * types of authentication the following field must be
 * sent in the body of the request authType.
 * The full request body should adhere to the following format.
 * {
 *    "authType": "business",
 *    "user": {
 *      "email": "someemail@email.com",
 *      "password": "password"
 *    }
 * }
 *
 * To authenticate we must execute the following code flow.
 * 1. Parse and verify the POST request.
 * 2. Check the user's email exists in the database.
 * 3. If the user's email exists, get the password.
 * 4. Compare the password sent in the POST request
 *    with the hashed password from the database.
 * 5. Send response based on the comparison of these passwords.
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
  else {
    return res
      .status(httpCodes.UNPROCESSABLE_ENTITY)
      .json({ responseMessage: "No authentication type given." });
  }
});


/***
 * Log in a user account.
 * @param req
 * @param res
 */
function userAuth(req, res) {
  var email = req.body.user.email;
  var password = req.body.user.password;

  if (!email || !password) {
    return res
      .status(httpCodes.UNPROCESSABLE_ENTITY)
      .json({ responseMessage: "Could not parse JSON." });
  }

  var user = new User();
  user.email = email;
  user.password = password;
  
  user.verify(function (err, verified) {
    delete user.password;

    if (err) {
      return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ responseMessage: "A server error occurred" });
    }
    if (verified) {
      var t = token.generateToken(user);
      return res.status(httpCodes.SUCCESS).json({
        expires: t.expiresIn,
        responseMessage: "Login Successful.",
        success: true,
        token: t.value
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

  if (!email || !password) {
    return res
      .status(httpCodes.UNPROCESSABLE_ENTITY)
      .json({ responseMessage: "Could not parse JSON." });
  }

  var business = new Business();
  business.email = email;
  business.password = password;

  business.verify(function (err, verified) {
    delete business.password;

    if (verified) {
      // TODO: Make sure id, name etc is attatched to business.
      var t = token.generateToken(business);
      return res.status(httpCodes.SUCCESS).json({
        expires: t.expiresIn,
        responseMessage: "Login Successful.",
        success: true,
        token: t.value
      });
    } else {
      return res.status(httpCodes.BAD_REQUEST).json({responseMessage: "Login Failed - Invalid Credentials"});
    }
  })
}


module.exports = router;