const util = require('../util');
const parser = require('../requestParser');
const errors = require('../errors');
const Product = require('../Product');

const controller = module.exports;


/**
 * Templates for what expected requests for /product endpoint
 * should look like.
 */
const expectedRequests = {
  POST: {
    name: util.isValidString,
    description: util.isValidString,
    price: util.isValidString,
    processing: util.isNumber,
  },
  PATCH: {
    id: util.isValidString,
    updateFields: util.isArray,
  },
  GET: {
    id: util.isValidString,
  },
};


/**
 * Handles a POST request on the /product endpoint.

 * @param {req} req - The request.
 * @param {function(err)} cb - Callback function.
 */
controller.handlePost = (req, cb) => {
  // Get the businessID from the decoded token.
  const businessID = req.decoded.id;
  if (!businessID) {
    return cb(errors.notAuthorized());
  }

  // Check the request contains a product.
  const product = req.body.product || null;
  if (!product) {
    return cb(errors.noObjectFound());
  }

  // Check valid request.
  parser.validProperties(expectedRequests.POST, product, function(err) {
    if (err) {
      return cb(errors.invalidProperties(err.invalidProperty));
    }
    const p = new Product();
    p.name = product.name;
    p.description = product.description;
    p.price = product.price;
    p.businessID = businessID;
    p.options = product.options;
    p.processing = product.processing;
    // Insert into database.
    p.insert((error) => {
      if (error) {
        cb(errors.serverError());
      } else {
        cb(null);
      }
    });
  });
};

/**
 * Handles a GET request on the /product endpoint.
 * 
 * @param {req} req - The request.
 * @param {function(err, products)} cb - Callback function.
 */
controller.handleGet = (req, cb) => {
  let businessID;
  // Check if the request is coming from a business
  // by asessing the incoming token.
  if (typeof req.decoded !== 'undefined') {
    if (req.decoded.clientType !== 'user') {
      businessID = req.decoded.id;
    }
  }
  if ('businessID' in req.query) {
    businessID = req.query.businessID;
  }
  if (!businessID) {
    return cb(errors.notAuthorized());
  }

  const product = new Product();
  product.getAllProductsForBusiness(businessID, (err, products) => {
    if (err) {
      return cb(errors.serverError());
    }
    return cb(null, products);
  });
};


/**
 * Handles a PATCH request on the /product endpoint.
 * @param {req} req - The request.
 * @param {function(err)} cb - Callback function.
 */
controller.handlePatch = (req, cb) => {
  if (typeof req.body.updatedProduct === 'undefined') {
    return cb(errors.noObjectFound('updatedProduct'));
  }
  const product = req.body.updatedProduct;

  // Check that the correct properties are attached to the
  // product to update.
  parser.validProperties(expectedRequests.PATCH, product, (err) => {
    if (err) {
      return cb(errors.invalidProperties(err.invalidProperty));
    }
    const p = new Product();
    p.id = product.id;
    // Update the product with the update fields from the request.
    p.update(product.updateFields, (error) => {
      if (error) {
        return cb(errors.serverError());
      }
      return cb(null);
    });
  });
};

/**
 * Handles a DELETE request on the /product/:productID endpoint.
 * @param {req} req - The request.
 * @param {function(err)} cb - Callback function.
 */
controller.handleDelete = (req, cb) => {
  // Get the product id from the request url.
  if (typeof req.params.productID === 'undefined') {
    return cb(errors.missingParam('productID'));
  }

  const productID = req.params.productID;
  // Delete the product.
  const product = new Product();
  product.id = productID;
  product.remove((err) => {
    if (err) {
      return cb(errors.serverError());
    }
    return cb(null);
  });
};
