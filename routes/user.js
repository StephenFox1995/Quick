'use strict';

const express = require('express');
const httpCodes = require('../libs/httpCodes');
const hash = require('../libs/hash');
const util = require('../libs/util');
const User = require('../libs/User');
const db = require('../models/database');

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
router.get('/id/:id', function (req, res) {
  var id = req.params.id;
  var user = new User();
  db.getUser(id, function(err, row) {
    if (err) {
      return res
        .status(httpCodes.INTERNAL_SERVER_ERROR)
        .json({responseMessage: "An error occurred."});
    }
    //TODO: if no row maybe return an error?
    res.status(httpCodes.SUCCESS).json(row);
  });
});


/**
 * Adds a new user to the database.
 * TODO: Make sure user doesn't already exist in database.
 **/
router.post('/', function (req, res) {
  var user = new User();
  user.parsePOST(req, function (err) {
    if (err) {
      return res.status(httpCodes.UNPROCESSABLE_ENTITY);
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
          .json({responseMessage: "User could not be added to the database."});
      }
      res.status(httpCodes.SUCCESS).json({responseMessage: "User was successfully created."});
    });

  })
});



module.exports = router;
