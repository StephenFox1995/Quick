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
  user.parsePOST(req,
    function sucess(user) {
      // Now hash password and store user in db.
      var hashed = hash.hashPassword(user.password);

      // Set the hashed user's password.
      user.password = hashed.hash;

      // Generate id for user.
      user.id = util.generateID();

      // Write to database.
      // TODO: Check if error occurred.
      user.insert(function () {
        res.sendStatus(httpCodes.SUCCESS);
      });
    },
    function failure() {
      res.sendStatus(httpCodes.UNPROCESSABLE_ENTITY);
    });
});



module.exports = router;
