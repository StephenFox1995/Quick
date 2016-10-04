'use strict';

var 
  express   = require('express'),
  httpCodes = require('../libs/httpCodes'),
  hash      = require('../libs/hash'),
  util      = require('../libs/util'),
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

    // Now hash user's password.
    var hashed = hash.hashPassword(user.password);

    // Set the hashed user's password.
    user.password = hashed.hash;

    // Generate id for user.
    user.id = util.generateID();

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

      // Remove the password from the user before generating token.
      delete user.password;

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
