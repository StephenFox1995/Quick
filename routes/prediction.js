const express = require('express');
const controller = require('../libs/controllers/predictionRouteController');
const router = express.Router();
const httpCodes = require('../libs/httpCodes');

router.get('/order/business/:id', (req, res) => {
  controller.handleOrderPrediction(req, (err, result) => {
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
        predictions: result,
      });
  });
});

router.get('/order/business/:id/currenthour', (req, res) => {
  controller.handleOrderPredictionCurrentHour(req, (err, data) => {
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
        predictions: { data: data },
      });
  });
});

router.get('/employeesneeded/business/:id', (req, res) => {
  controller.handleEmployeesNeededPrediction(req, (err, result) => {
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
        predictions: result,
      });
  });
});

router.get('/employeesneeded/business/:id/currenthour', (req, res) => {
  controller.handleEmployeesNeededCurrentHour(req, (err, data) => {
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
        predictions: { data: data },
      });
  });
});

module.exports = router;


