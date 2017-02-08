const vr = require('../libs/validRequest');
const httpCodes = require('../libs/httpCodes');
const controller = require('../libs/controllers/orderRouteController');
const express = require('express');

const router = express.Router();

router.post('/', vr.validRequest, (req, res) => {
  controller.handlePost(req, (err, orderID) => {
    if (err) {
      return res
        .status(err.code)
        .json({
          success: false,
          responseMessage: err.message,
        });
    }
    return res
      .status(httpCodes.SUCCESS)
      .json({
        success: true,
        order: { id: orderID },
      });
  });
});

router.get('/', vr.validRequest, (req, res) => {
  controller.handleGet(req, (err, orders) => {
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
        orders,
      });
  });
});

router.get('/:id', vr.validRequest, (req, res) => {
  controller.handleGetByID(req, (err, order) => {
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
        order,
      });
  });
});


module.exports = router;
