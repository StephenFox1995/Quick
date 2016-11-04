'use strict';

var 
  vr        = require('../libs/validRequest'),
  httpCodes = require('../libs/httpCodes'),
  controller = require('../libs/controllers/orderRouteController'),
  express = require('express');

var router = express.Router();

router.post('/', vr.validRequest, function(req, res) {
  controller.handlePost(req, function(err, orderID) {
    if (err) {
      return res
        .status(err.code)
        .json({
          success: false,
          responseMessage: err.message
        });
    }

    return res
      .status(httpCodes.SUCCESS)
      .json({
        success: true,
        order: { id: orderID } 
      });
  });
});

router.get('/', vr.validRequest, function(req, res) {
  controller.handleGet(req, function(err, orders) {
    if (err) {
      return res
        .status(err.code)
        .json({
          success: false,
          responseMessage: err.message });
    }
    return res
      .status(httpCodes.SUCCESS)
      .json({
        success: true,
        orders: orders 
      });
  }); 
});


module.exports = router;