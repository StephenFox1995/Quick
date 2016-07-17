'use strict';

const Product = require('../libs/Product');
const httpCodes = require('../libs/httpCodes');
const util = require('../libs/util');
const express = require('express');
const db = require('../models/database');


var router = express.Router();

router.get('/:id', function (req, res) {
  const id = req.params.id;
  db.getProduct(id, function (err, row) {
    if (err) {
      return res
        .status(httpCodes.INTERNAL_SERVER_ERROR)
        .json({responseMessage: "Internal server error."});
    } else {
      return res.status(httpCodes.SUCCESS).json(row);
    }
  });
});




router.post('/', function (req, res) {
  var product = new Product();
  // Parse post request.
  product.parsePOST(req, function (err) {
    if (err) {
      return res
        .status(httpCodes.UNPROCESSABLE_ENTITY)
        .json({responseMessage: "Could not parse Product JSON."});
    }

    // TODO: Look into longer id for product.
    product.id = util.generateID();

    // Insert into database.
    product.insert(function (err) {
      if (err) {
        console.log(err);
        return res
          .status(httpCodes.INTERNAL_SERVER_ERROR)
          .json({responseMessage: "Product could not be added to the database."});
      }
      res
        .status(httpCodes.SUCCESS)
        .json({responseMessage: "Product was successfully created."});
    });
  });
});


module.exports = router;
