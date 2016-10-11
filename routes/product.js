'use strict';

var
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
  var product = new Product();
  // Set the businessID of the product to the businessID of the token from request. 
  product.businessID = req.decoded.id;
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
    // Now check to see if the businessID of the product being
    // added matches the id from the decoded token.
    // This is to make sure the product is actually being added by the business
    // and not somebody else, who happens to have the business id.
    if (product.businessID !== req.decoded.id) {
      return res
        .status(httpCodes.UNAUTHORIZED)
        .json({
          success: false,
          responseMessage: "Not authorized to add product."
        });
    }
    // Insert into database.
    product.insert(function (err) {
      if (err) {
        return res
          .status(httpCodes.INTERNAL_SERVER_ERROR)
          .json({
            success: false,
            responseMessage: "Product could not be added to the database."
          });
      }
      return res
        .status(httpCodes.SUCCESS)
        .json({
          success: true,
          responseMessage: "Product was successfully added."
        });
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

/**
 * GET products based on the body.
 **/
router.get('/', vr.validRequest, function (req, res) {
  var businessID = req.decoded.id;

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
