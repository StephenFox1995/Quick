'use strict';

var 
  Product = require('../libs/Product'),
  httpCodes = require('../libs/httpCodes'),
  util = require('../libs/util'),
  express = require('express'),
  db = require('../models/database'),
  vr = require('../libs/validRequest');


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



router.post('/', vr.validPOSTRequest, function (req, res) {
  var product = new Product();
  // Parse post request.
  product.parsePOST(req, function (err) {
    if (err) {
      return res
        .status(httpCodes.UNPROCESSABLE_ENTITY)
        .json({
          success: false,
          responseMessage: "Could not parse Product JSON."
        });
    }

    // TODO: Look into longer id for product.
    product.id = util.generateID();

    // Insert into sqlite3DB.
    product.insert(function (err) {
      if (err) {
        return res
          .status(httpCodes.INTERNAL_SERVER_ERROR)
          .json({
            success: false,
            responseMessage: "Product could not be added to the database."
          });
      }
      res
        .status(httpCodes.SUCCESS)
        .json({
          success: true,
          responseMessage: "Product was successfully added."
        });
    });
  });
});


module.exports = router;
