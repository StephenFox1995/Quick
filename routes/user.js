'use strict';

var 
  express   = require('express'),
  httpCodes = require('../libs/httpCodes'),
  
  User      = require('../libs/User'),
  token     = require('../libs/token');


const router = express.Router();


/**
 * Adds a new user to the database.
 * EndPoint: /user
 * TODO: Make sure user doesn't already exist in database
 **/
router.post('/', function (req, res) {
  var user = new User();
  user.parsePOST(req, function (err) {
    if (err) {
      return res
        .status(httpCodes.UNPROCESSABLE_ENTITY)
        .json({
          responseMessage: "Could not parse user.",
          success: false
        });
    }
    
    // Save to database.
    user.insert(function (err) {
      if (err) {
        return res
          .status(httpCodes.INTERNAL_SERVER_ERROR)
          .json({
            responseMessage: "User could not be added to the database.",
            success: false
          });
      }

      // Generate token.
      var t = token.generateToken(user);
      return res
        .status(httpCodes.SUCCESS)
        .json({
          responseMessage: "User was successfully created.",
          success: true,
          token: t.value,
          expires: t.expiresIn
        });
    });
  });
});



module.exports = router;
