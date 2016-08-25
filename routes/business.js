'use strict';

var 
  Business  = require('../libs/Business'),
  httpCodes = require('../libs/httpCodes'),
  hash      = require('../libs/hash'),
  util      = require('../libs/util'),
  db        = require('../models/database'),
  token     = require('../libs/token'),
  express   = require('express'),
  vr        = require('../validRequest');  


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

    // Hash the password.
    var hashed = hash.hashPassword(bs.password);
    bs.hashedPassword = hashed.hash;

    // Generate id for business.
    bs.id = util.generateID();

    bs.insert(function (err) {
      if (err) {
        return res
          .status(httpCodes.INTERNAL_SERVER_ERROR)
          .json({
            responseMessage: "Business could not be added to the database.",
            success: false
          });
      }

      // Remove the password before generating a token.
      delete bs.hashedPassword;
      delete bs.password;

      var t = token.generateToken(bs);

      res
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


router.get('/info', vr.validPOSTRequest, function (req, res) {
  var token = req.decoded;

  db.getBusinessInfo(token.id, function (err, row) {
    if (err || !row) {
      return res
        .status(httpCodes.INTERNAL_SERVER_ERROR)
        .json({responseMessage: "An error occurred."});
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
module.exports = router;
