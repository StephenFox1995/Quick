'use strict';

var 
  Product = require('../libs/Product'),
  httpCodes = require('../libs/httpCodes'),
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



router.post('/', vr.validRequest, function (req, res) {
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
router.patch('/', vr.validRequest, function(req, res) {
  var product = new Product();
  // Get the fields for updating.
  var updateFields = product.parsePATCH(req);
  
  product.update(updateFields, function(err) {
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



module.exports = router;
