'use strict';

var 
  vr        = require('../libs/validRequest'),
  httpCodes = require('../libs/httpCodes'),
  controller = require('../libs/controllers/orderRouteController');

var express = require('express');
var router = express.Router();


router.post('/', vr.validRequest, function(req, res) {
  controller.handlePost(req, function(err, orderID) {
    if (err) {
      return res
        .status(err.code)
        .json({
          success: false,
          responseMessage: err.message});
    }

    return res
      .status(httpCodes.SUCCESS)
      .json({
        success: true,
        order: { id: orderID } 
      });
  });
});


module.exports = router;