'use strict';

const Purchase = require('../libs/Purchase');
const httpCodes = require('../libs/httpCodes');
const util = require('../libs/util');

const express = require('express');

var router = express.Router();

router.post('/', function (req, res) {
  var purchase = new Purchase();

  purchase.parsePOST(req, function (err) {
    if (err) {
      return res
        .status(httpCodes.UNPROCESSABLE_ENTITY)
        .json({responseMessage: "Could not parse Purchase JSON."})
    }

    // Generate ID for pruchase.
    purchase.id = util.generateID();

    purchase.insert(function (err) {
      if (err) {
        console.log(err);
        return res
          .status(httpCodes.INTERNAL_SERVER_ERROR)
          .json({responseMessage: "{ Purchase could not be processed at this time."});
      }
      res.status(httpCodes.SUCCESS).json({responseMessage: "Purchase was successfully created."});
    });
  });
});

module.exports = router;