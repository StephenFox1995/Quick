'use strict';

var
  Business = require('../libs/Business'),
  httpCodes = require('../libs/httpCodes'),
  vr        = require('../libs/validRequest'),
  token     = require('../libs/token'),
  express   = require('express');

var router = express.Router();

/**
 ******************* Description ***********************
 * Adds a new Business to the database.
 *
 ****************** Request ***********************
 * This endpoint expects the request body
 * to contain the following:
 *  - business object
 *    {
 *      business {
 * 
 *      }
 *    }
 * The business object has to have the following fields.
 * - {string} name - The name of the business.
 * - {string} address- The address of the business.
 * - {string} contactNumber - The contact number of the business.
 * - {string} email - The email of the business.
 * - {string} password - The password associated with this business account.
 * 
 * Therefore the following would be a valid request body:
 * {
 *      business {
 *        name: "Test Business",
 *        address: "22 Test Address, Dublin",
 *        contactNumber: "0850920992",
 *        email: "testBusiness@test.com",
 *        password: "strong-password"
 *      }
 * }
 * 
 ******************** Responses ***********************
 * Success - Business was successfully added
 * - HTTP Code: 200
 * 
 * Failed - Missing attribute
 * - HTTP Code: 422
 * 
 * Failed - Internal Server Error
 * - HTTP Code: 500
 *********************************************************
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

