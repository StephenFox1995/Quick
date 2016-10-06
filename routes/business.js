'use strict';

var
  Business = require('../libs/Business'),

  Product = require('../libs/Product'),
  httpCodes = require('../libs/httpCodes'),
  vr = require('../libs/validRequest'),
  token = require('../libs/token'),
  express = require('express');

var router = express.Router();

/**
 * Add a new Business to the database.
 * */
router.post('/', function (req, res) {
  var bs = new Business();

  bs.parsePOST(req, function (err) {
    if (err) {
      return res
        .status(httpCodes.UNPROCESSABLE_ENTITY)
        .json({
          responseMessage: "Could not parse JSON",
          success: false
        });
    }

    bs.insert(function (err) {
      if (err) {
        return res
          .status(httpCodes.INTERNAL_SERVER_ERROR)
          .json({
            responseMessage: "Business could not be added to the database.",
            success: false
          });
      }

      var t = token.generateToken(bs);
      return res
        .status(httpCodes.SUCCESS)
        .json({
          responseMessage: "Business was successfully created.",
          success: true,
          token: t.value,
          expires: t.expiresIn
        });
    });
  });
});



/**
 * GET all products associated with a business.
 * URL: /business/someRandomID/products
 **/
router.get('/:businessID/products', function (req, res) {
  var businessID = req.params.businessID;
  if (!businessID) {
    return res
      .status(httpCodes.UNPROCESSABLE_ENTITY)
      .json({ 
        responseMessage: "Could not process request.",
        success: false 
      });
  }

  var product = new Product();
  product.getAllProductsForBusiness(businessID, function(err, products) {
    if (err) {
      return res
        .status(httpCodes.UNPROCESSABLE_ENTITY)
        .json({ 
          responseMessage: "An error occurred.",
          success: true 
        });
    }
    return res.status(httpCodes.SUCCESS).json({ 
      products: products,
      success: true
    });
  });
});


/**
 * /business/all
 * Returns all businesses in the database.
 * */
router.get('/all', function (req, res) {
  var business = new Business();
  business.all(function(err, businesses) {
    if (err) {
      return res
        .status(httpCodes.INTERNAL_SERVER_ERROR)
        .json({ responseMessage: "An error occurred" });
    }
    return res.status(httpCodes.SUCCESS).json(businesses);
  });
});

module.exports = router;

