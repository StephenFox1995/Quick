'use strict';

var 
  express   = require('express'),
  httpCodes = require('../libs/httpCodes'),
  hash      = require('../libs/hash'),
  util      = require('../libs/util'),
  User      = require('../libs/User'),
  db        = require('../models/database'),
  vr      = require('../libs/validRequest');


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

    // Write to database.
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


/**
 * EndPoint: /user/info
 **/
router.get('/info', vr.validPOSTRequest, function (req, res) {
  var token = req.decoded;

  db.getUserInfo(token.id, function(err, row) {
    if (err || !row) {
      return res
        .status(httpCodes.INTERNAL_SERVER_ERROR)
        .json({responseMessage: "An error occurred."});
    }
    if (row) {
      return res.status(httpCodes.SUCCESS).json(row);
    }
  });
});


module.exports = router;
