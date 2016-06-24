'use strict';

const express = require('express');
const httpCodes = require('../libs/httpCodes');
const hash = require('../libs/hash');
const util = require('../libs/util');
const User = require('../libs/User');

const router = express.Router();


/**
 * Adds a new user to the database.
 * TODO: Make sure user doesn't already exist in database.
 **/
router.post('/', function (req, res) {
  var user = new User();
  user.parsePOST(req, function (err, user) {
    if (err) {
      return res.sendStatus(httpCodes.UNPROCESSABLE_ENTITY);
    }

    // Now hash password and store user in db.
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
          .json({responseMessage: "User could not be created."});
      }
      res.status(httpCodes.SUCCESS).json({responseMessage: "User was successfully created."});
    });

  })
});


module.exports = router;
