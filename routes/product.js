'use strict';

var
  controller = require('../libs/productRouteController'),
  Product   = require('../libs/Product'),
  httpCodes = require('../libs/httpCodes'),
  express   = require('express'),
  vr        = require('../libs/validRequest');


var router = express.Router();

/**
 ******************* Description ***********************
 * Adds a new Product to the database.
 *
 ****************** Request ***********************
 * This endpoint expects the request body
 * to contain the following:
 *  - business object
 *    {
 *      product {
 * 
 *      }
 *    }
 * The business object has to have the following fields.
 * - {string} name - The name of the product.
 * - {float} price - The price of the product.
 * - {description} description - The description of the product.
 * 
 * Therefore the following would be a valid request body:
 * {
 *      business {
 *        name: "Test Product",
 *        price: 2.30,
 *        description: "Description of product"        
 *   
 *      }
 * }
 * 
 ******************** Responses ***********************
 * Success - Product was successfully added
 * - HTTP Code: 200
 * 
 * Failed - Missing attribute
 * - HTTP Code: 422
 * 
 * Failed - Internal Server Error
 * - HTTP Code: 500
 *********************************************************
 * */
router.post('/', vr.validRequest, function (req, res) {
  controller.handlePost(req, function(err) {
    if (err) {
      return res
        .status(err.code)
        .json({
          message: err.message, 
          success: false
        });
    } else {
      return res
        .status(httpCodes.SUCCESS)
        .json({
          success: true,
          responseMessage: "Product was successfully added."
        });
    }
  });
});

/**
 * GET products based on the body.
 **/
router.get('/', vr.validRequest, function (req, res) {
  controller.handleGet(req, function(err, products) {
    if (err) {
      return res
        .status(err.code)
        .json({
          message: err.message, 
          success: false
        }); 
    }
    return res
      .status(httpCodes.SUCCESS)
      .json({
        products: products,
        success: true
      });
  });
});


/**
 * Update a product.
 */
router.patch('/', vr.validRequest, function (req, res) {
  var product = new Product();
  // Get the fields for updating.
  var updateFields = product.parsePATCH(req);

  product.update(updateFields, function (err) {
    if (err) {
      return res
        .status(httpCodes.INTERNAL_SERVER_ERROR)
        .json({
          success: false,
          responseMessage: "Product could not be updated."
        });
    }

    return res
      .status(httpCodes.SUCCESS)
      .json({
        success: true,
        responseMessage: "Product was successfully updated."
      });
  });
});




//Todo: Validate that the product desired to be deleted belongs to the company trying to delete it.
// Remove a product
router.delete('/:productID', vr.validRequest, function (req, res) {
  var product = new Product();
  product.parseDelete(req, function (err) {
    if (err) {
      return res
        .status(httpCodes.UNPROCESSABLE_ENTITY)
        .json({
          success: false,
          responseMessage: "Could not parse Product JSON."
        });
    }
    // Delete the product.
    product.remove(function (err) {
      if (err) {
        return res
          .status(httpCodes.INTERNAL_SERVER_ERROR)
          .json({
            success: false,
            responseMessage: "Product could not be removed."
          });
      }

      return res
      .status(httpCodes.SUCCESS)
      .json({
        success: true,
        responseMessage: "Product was successfully removed."
      });
    });
  });
});


module.exports = router;
