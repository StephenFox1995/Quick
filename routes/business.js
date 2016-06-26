'use strict';

const Business = require('../libs/Business');
const httpCodes = require('../libs/httpCodes');
const hash = require('../libs/hash');
const util = require('../libs/util');
const express = require('express');




var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});


/**
 * Add a new Business to the database.
 * */
router.post('/', function (req, res) {
  var bs = new Business();
  bs.parsePOST(req, function (err) {
    if (err) {
      return res.sendStatus(httpCodes.UNPROCESSABLE_ENTITY);
    }
    // Hash the password.
    var hashed = hash.hashPassword(bs.password);
    bs.hashedPassword = hashed.hash;

    // Generate id for business.
    bs.id = util.generateID();

    bs.insert(function (err) {
      if (err) {
        return res
          .status(httpCodes.INTERNAL_SERVER_ERROR)
          .json({responseMessage: "Business could not be added to the database."});
      }
      res.status(httpCodes.SUCCESS).json({responseMessage: "Business was successfully created."});
    });
  });
});


module.exports = router;
