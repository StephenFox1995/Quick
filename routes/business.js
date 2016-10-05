'use strict';

var
  Business = require('../libs/Business'),
  httpCodes = require('../libs/httpCodes'),
  db = require('../models/database'),
  token = require('../libs/token'),
  express = require('express'),
  vr = require('../libs/validRequest'),
  Purchase = require('../libs/Purchase');


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


router.get('/info', vr.validRequest, function (req, res) {
  var token = req.decoded;

  db.getBusinessInfo(token.id, function (err, row) {
    if (err || !row) {
      return res
        .status(httpCodes.INTERNAL_SERVER_ERROR)
        .json({ responseMessage: "An error occurred." });
    }
    if (row) {
      return res.status(httpCodes.SUCCESS).json(row);
    }
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

  db.getAllBusinessProducts(businessID, function (err, rows) {
    if (err) {
      return res
        .status(httpCodes.UNPROCESSABLE_ENTITY)
        .json({ 
          responseMessage: "An error occurred.",
          success: true 
        });
    }
    
    return res.status(httpCodes.SUCCESS).json({ 
      products: rows,
      success: true
    });
  });
});


/// business/purchases
router.get('/purchases', vr.validRequest, function (req, res) {
  var purchase = new Purchase();
  var token = req.decoded; // Get businessID.
  var bs = new Business();
  bs.id = token.id;
  purchase.getPurchases(bs, function (err, purchases) {
    if (err) {
      return res
        .status(httpCodes.INTERNAL_SERVER_ERROR)
        .json({
          responseMessage: "Could not retrieve purchases.",
          success: false
        });
    }
    return res
      .status(httpCodes.SUCCESS)
      .json({
        success: true,
        purchases: purchases
      });
  });
});

/**
 * /business/all
 * Returns all businesses in the database.
 * */
router.get('/all', function (req, res) {
  db.getAllBusiness(function (err, rows) {
    if (err) {
      return res
        .status(httpCodes.INTERNAL_SERVER_ERROR)
        .json({ responseMessage: "An error occurred" });
    }
    res.status(httpCodes.SUCCESS).json(rows);
  });
});

module.exports = router;

