'use strict';


var express = require('express'),
    User = require('../libs/User'),
    httpCodes = require('../libs/httpCodes');


var router = express.Router();


/**
 * To sign in we must execute the following steps.
 * 1. Parse and verify the POST request.
 * 2. Check the user exists and password is valid.
 * 3. Return response saying the user has been signed in.
 * {"
 *  user": {
 *    "email": "something@something.com",
 *    "password": "somepassword"
 *  }
 * }
 * */
router.post('/', function (req, res) {

  var email = req.body.user.email;
  var password = req.body.user.password;

  var user = new User();
  user.email = email;
  user.password = password;

  user.verify(function (err, verified) {
    if (err) {
      res.status(httpCodes.INTERNAL_SERVER_ERROR).json({responseMessage: "A server error occurred"});
    } else {
      if (verified) {
        res.status(httpCodes.SUCCESS).json({responseMessage: "Login Successful."});
      } else {
        res.status(httpCodes.BAD_REQUEST).json({responseMessage: "Login Failed - Invalid Credentials"});
      }
    }
  });
});

module.exports = router;