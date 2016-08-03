'use strict';

var Business = require('../libs/Business'),
    httpCodes = require('../libs/httpCodes'),
    hash = require('../libs/hash'),
    util = require('../libs/util'),
    db = require('../models/database'),
    express = require('express');




var router = express.Router();


/**
 * /business/all
 * Returns all businesses in the database.
 * */
router.get('/all', function (req, res) {
  db.getAllBusiness(function (err, rows) {
    if (err) {
      return res
        .status(httpCodes.INTERNAL_SERVER_ERROR)
        .json({responseMessage: "An error occurred"});
    }
    res.status(httpCodes.SUCCESS).json(rows);
  });
});

/**
 * GET all products associated with a business.
 * URL: /business/someRandomID/products
 **/
router.get('/:businessID/products', function(req, res) {
  var businessID = req.params.businessID;
  if (!businessID) {
    return res
      .status(httpCodes.UNPROCESSABLE_ENTITY)
      .json({responseMessage:"Could not process request."});
  }

  db.getAllBusinessProducts(businessID, function (err, rows) {
    if (err) {
      return res
        .status(httpCodes.INTERNAL_SERVER_ERROR)
        .json({responseMessage:"An error occurred."});
    }
    res.status(httpCodes.SUCCESS).json({products: rows});

  });
});


/**
 * Add a new Business to the database.
 * */
router.post('/', function (req, res) {
  var bs = new Business();
  bs.parsePOST(req, function (err) {
    if (err) {
      return res
        .status(httpCodes.UNPROCESSABLE_ENTITY)
        .json({responseMessage: "Could not parse JSON"});
    }
    // Hash the password.
    var hashed = hash.hashPassword(bs.password);
    bs.hashedPassword = hashed.hash;

    // Generate id for business.
    bs.id = util.generateID();

    bs.insert(function (err) {
      if (err) {
        return res
          .status(httpCodes.INTERNAL_SERVER_ERROR)
          .json({responseMessage: "Business could not be added to the database."});
      }
      res
        .status(httpCodes.SUCCESS)
        .json({responseMessage: "Business was successfully created."});
    });
  });
});


module.exports = router;
