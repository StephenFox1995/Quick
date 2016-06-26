'use strict';

const Product = require('../libs/Product');
const httpCodes = require('../libs/httpCodes');
const util = require('../libs/util');
const express = require('express');


var router = express.Router();


router.post('/', function (req, res) {
  var product = new Product();
  // Parse post request.
  product.parsePOST(req, function (err) {
    if (err) {
      return res.status(httpCodes.UNPROCESSABLE_ENTITY)
        .json({responseMessage: "Could not parse Product JSON"});
    }

    // TODO: Look into longer id for products.
    product.id = util.generateID();

    // Insert into database.
    product.insert(function (err) {
      if (err) {
        console.log(err);
        return res
          .status(httpCodes.INTERNAL_SERVER_ERROR)
          .json({responseMessage: "Product could not be created."});
      }
      res.status(httpCodes.SUCCESS).json({responseMessage: "Product was successfully created."});
    });
  });
});


module.exports = router;
