'use strict';


var express = require('express'),
    User = require('../libs/User'),
    httpCodes = require('../libs/httpCodes');


var router = express.Router();


/**
 * To authenticate we must execute the code flow.
 * 1. Parse and verify the POST request.
 * 2. Check the user's email exists in the database.
 * 3. If the user's email exists, get the password.
 * 4. Compare the password sent in the POST request
 *    with the hashed password from the database.
 * 5. Send response based on the comparison of these passwords.
 *
 *  The post request should include the user as follows.
 *
 * {"
 *  user": {
 *    "email": "something@something.com",
 *    "password": "somepassword"
 *  }
 * }
 *
 * A successful login attempt will return HTTP Code 200.
 * A failed login attempt will return a HTTP Code 400.
 * */
router.post('/', function (req, res) {
  var email = req.body.user.email;
  var password = req.body.user.password;

  var user = new User();
  user.email = email;
  user.password = password;

  user.verify(function (err, verified) {
    user.email = null;
    user.password = null;
    if (err) {
      return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({responseMessage: "A server error occurred"});
    }
    if (verified) {
      return res.status(httpCodes.SUCCESS).json({responseMessage: "Login Successful."});
    } else {
      return res.status(httpCodes.BAD_REQUEST).json({responseMessage: "Login Failed - Invalid Credentials"});
    }
  });
});

module.exports = router;