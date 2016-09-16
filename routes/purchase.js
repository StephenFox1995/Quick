'use strict';

var 
  Purchase  = require('../libs/Purchase'),
  httpCodes = require('../libs/httpCodes'),
  util      = require('../libs/util'),
  User      = require('../libs/User'),
  vr        = require('../libs/validRequest');

const express = require('express');

var router = express.Router();

/**
 * /purchase
 * */
router.post('/', vr.validPOSTRequest, function (req, res) {
  var purchase = new Purchase();
  purchase.parsePOST(req, function (err) {
    if (err) {
      return res
        .status(httpCodes.UNPROCESSABLE_ENTITY)
        .json({
          success: false,
          responseMessage: "Could not parse Purchase JSON."});
    }

    // Generate ID for purchase.
    purchase.id = util.generateID();

    purchase.insert(function (err) {
      if (err) {
        return res
          .status(httpCodes.INTERNAL_SERVER_ERROR)
          .json({
            success: false,
            responseMessage: "Purchase could not be processed at this time."
          });
      }
      return res
        .status(httpCodes.SUCCESS)
        .json({
          success: true,
          responseMessage: "Purchase was successfully made.",
          purchaseID: purchase.id
        });
    });
  });
});

router.get('/', vr.validPOSTRequest, function (req, res) {
  var userID = req.decoded.id;
  var user = new User();
  user.getPurchases(userID, function (err, purchases) {
    if (err) {
      return res
        .status(httpCodes.INTERNAL_SERVER_ERROR)
        .json({
          responseMessage: "Could not retrieve purchases.",
          success: false
        });
    }
    return res
            .status(httpCodes.SUCCESS)
            .json({
              success: true,
              purchases: purchases
            });
  });
});




module.exports = router;