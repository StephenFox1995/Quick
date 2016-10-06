'use strict';

var 
  vr        = require('../libs/validRequest'),
  Order     = require('../libs/Order'),
  httpCodes = require('../libs/httpCodes');

const express = require('express');
var router = express.Router();


router.post('/', vr.validRequest, function(req, res) {
  var order = new Order();
  order.parsePOST(req, function(err) {
    if (err) {
      return res
        .status(httpCodes.UNPROCESSABLE_ENTITY)
        .json({
          success: false,
          responseMessage: "Could not parse order."});
    }
  });

  order.insert(function(err, orderID) {
    if (err) {
      return res
        .status(httpCodes.INTERNAL_SERVER_ERROR)
        .json({
          responseMessage: "Could not process order.",
          success: false
        });
    }

    return res
      .status(httpCodes.SUCCESS)
      .json({
        success: true,
        order: { orderID: orderID } 
      });
  });
});


module.exports = router;