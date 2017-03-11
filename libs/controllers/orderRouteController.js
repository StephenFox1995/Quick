const util = require('../util');
const parser = require('../requestParser');
const errors = require('../errors');
const Order = require('../Order');
const request = require('request');

const controller = module.exports;


const expectedRequests = {
  POST: {
    cost: util.isNumber,
    businessID: util.isValidString,
    coordinates: util.isObject,
    processing: util.isNumber,
    products: util.isObject,
  },
};

/**
 * Handles a POST request on the /order endpoint.
 *
 * @param {req} req - The request.
 * @param {function(err, orderID)} cb - Callback function.
 */
controller.handlePost = (req, cb) => {
  // Grab the user id from the token.
  const userID = req.decoded.id || null;
  if (!userID) {
    return cb(errors.notAuthorized());
  }
  // Get the order from req body.
  const order = req.body.order || null;
  if (!order) {
    return cb(errors.noObjectFound('order'));
  }

  // Check that there is the appropriate properties in order.
  parser.validProperties(expectedRequests.POST, order, (err) => {
    if (err) {
      return cb(errors.invalidProperties(err.invalidProperty));
    }

    const o = new Order();
    o.userID = userID;
    o.businessID = order.businessID;
    o.coordinates = order.coordinates;
    o.cost = order.cost;
    o.status = 'unprocessed';
    o.processing = order.processing;
    o.travelMode = order.travelMode;
    o.products = order.products;

    // Insert the order to the database.
    o.insert((err, orderID) => {
      if (err) {
        return cb(errors.serverError());
      }
      return cb(null, orderID)
    });
  });
};

controller.handleOrderCollectionTime = (req, cb) => {
  const url = `http://localhost:6566/tasks/deadline?id=${req.params.id}&businessid=${req.params.businessid}`;
  request(url, function(err, res, body) {
    if (res.statusCode == 200) {
      cb(err, JSON.parse(body));
    }
  });
}
/**
 * Handles a GET request on the /order endpoint.
 *
 * @param {req} req - The request.
 * @param {function(err, orderID)} cb - Callback function.
 */
controller.handleGet = (req, cb) => {
  let reqData = null;
  try {
    reqData = controller.processRequestData(req);
  } catch (e) {
    cb(e.message);
  }

  // Client could be a user or business.
  const order = new Order();
  order.get(reqData, (err, orders) => {
    if (err) {
      cb(errors.serverError());
    } else {
      cb(null, orders);
    }
  });
};

// Get an order by its id.
controller.handleGetByID = (req, cb) => {
  const id = req.params.id;
  const order = new Order();
  order.getByID(id, (err, result) => {
    if (err) {
      return cb(errors.serverError());
    }
    return cb(null, result);
  });
};

controller.handleFinishOrder = (req, cb) => {
  const id = req.params.id;
  const reqOrder = req.body.order;
  const order = new Order();
  // Set these order attributes so they
  // the database records them correctly.
  order.release = reqOrder.release;
  order.deadline = reqOrder.deadline;
  order.finishTime = Date.now();
  order.finish(id, (err, result) => {
    if (err) {
      cb(errors.serverError());
    } else {
      cb(null, result);
    }
  });
};

// Process request data to look for certain attributes.
controller.processRequestData = function processRequestData(req) {
  const clientID = req.decoded.id || null;
  if (!clientID) {
    throw (new Error(errors.notAuthorized()));
  }
  const clientType = req.decoded.clientType || null;
  if (!clientType) {
    throw (new Error(errors.notAuthorized()));
  }
  return { clientID, clientType };
};
