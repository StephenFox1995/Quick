const express = require('express');
const controller = require('../libs/controllers/predictionRouteController');
const router = express.Router();
const httpCodes = require('../libs/httpCodes');

router.get('/order/business/:id', (req, res) => {
  controller.handleOrderPrediction(req, (err, data) => {
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
        prediction: { data: data },
      });
  });
});

module.exports = router;


