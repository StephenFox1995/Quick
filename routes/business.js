'use strict';

var
  Business    = require('../libs/Business'),
  httpCodes   = require('../libs/httpCodes'),
  express     = require('express'),
  controller  = require('../libs/controllers/businessRouteController'),
  vr          = require('../libs/validRequest');

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
  controller.handlePost(req, function(err, token) {
    if (err) {
      return res
        .status(err.code)
        .json({
          responseMessage: err.message,
          success: false
        }); 
    }       
    return res
      .status(httpCodes.SUCCESS)
      .json({
        responseMessage: "Business was successfully created.",
        success: true,
        token: token.value,
        expires: token.expiresIn
      });
  });
});



/**
 * /business/all
 * Returns all businesses in the database.
 * */
router.get('/all', function (req, res) {
  controller.handleGet(req, function(err, businesses) {
    if (err) {
      return res
        .status(err.code)
        .json({
          responseMessage: err.message,
          success: false
        }); 
    }
    return res.status(httpCodes.SUCCESS).json(businesses);
  });
});

router.get('/status/:businessid', function (req, res) {
  controller.handleStatus(req, function(err, status) {
    if (err) {
      return res
        .status(err.code)
        .json({
          responseMessage: err.message,
          success: false
        }); 
    }
    return res
      .status(httpCodes.SUCCESS)
      .json({
        status: status
      });
  })
})

module.exports = router;

