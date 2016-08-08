'use strict';

var express   = require('express'),
    httpCodes = require('../libs/httpCodes'),
    hash      = require('../libs/hash'),
    util      = require('../libs/util'),
    User      = require('../libs/User'),
    db        = require('../models/database'),
    auth      = require('../libs/auth');


const router = express.Router();


/**
 * /user/all
 * Returns all users in the database.
 **/
router.get('/all', function (req, res) {
  db.getAllUsers(function (err, rows) {
    if (err) {
      return res
        .status(httpCodes.INTERNAL_SERVER_ERROR)
        .json({responseMessage: "An error occurred."});
    }
    res.status(httpCodes.SUCCESS).json(rows);
  });
});


/**
 * URL: /user/id/someID
 **/
router.get('/id/:id', auth.validToken, function (req, res) {
  var id = req.params.id;

  db.getUserInfo(id, function(err, row) {
    if (err) {
      return res
        .status(httpCodes.INTERNAL_SERVER_ERROR)
        .json({responseMessage: "An error occurred."});
    }
    //TODO: if no row maybe return an error?
    return res.status(httpCodes.SUCCESS).json(row);
  });
});


/**
 * Adds a new user to the database.
 * /user
 * TODO: Make sure user doesn't already exist in database.
 **/
router.post('/', function (req, res) {
  var user = new User();
  user.parsePOST(req, function (err) {
    if (err) {
      return res.status(httpCodes.UNPROCESSABLE_ENTITY);
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
            type: false
          });
      }

      // Removed the password from the user before generating token.
      delete user.password;

      // Generate token.
      var token = auth.generateToken(user);

      return res
        .status(httpCodes.SUCCESS)
        .json({
          responseMessage: "User was successfully created.",
          type: true,
          token: token.value,
          expires: token.expiresIn
        });
    });
  })
});



module.exports = router;
