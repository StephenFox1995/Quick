const util = require('../util');
const parser = require('../requestParser');
const errors = require('../errors');
const tk = require('../token');
const Business = require('../Business');
const hash = require('../hash');
const request = require('request');
const moment = require('moment');

const controller = module.exports;

// Expected requests.
const expectedRequests = {
  POST: {
    email: util.isValidString,
    password: util.isValidString,
    name: util.isValidString,
    address: util.isValidString,
    contactNumber: util.isValidString,
    period: util.isObject,
  },
};

function currentUtlizationStatus(utilization) {
  for (var i = 0; i < utilization.length; i++) {
    let startRange = new Date(utilization[i].begin);
    let endRange = new Date(utilization[i].end);
    if (moment(new Date()).isBetween(startRange, endRange)) {
      return utilization[i].status;
    }
  }
  return "ok";
}

/**
 * Handles a GET request on the /business endpoint.
 * @param {req} req - The request.
 * @param {function(err, token)} cb - Callback function.
 */
controller.handleGet = function handleGet(req, cb) {
  return new Business().all(cb);
};

controller.handleStatus = function(req, cb) {
  const businessID = req.params.businessid;
  const url = `http://localhost:6566/tasks?id=${businessID}`;
  request(url, function(err, res, body) {
    if (res.statusCode == 200) {
      let utilization = JSON.parse(body).state.conflicts.utilization;
      let status = currentUtlizationStatus(utilization)
      cb(err, status);
    }
  });
}

/**
 * Handles a POST request on the /business endpoint.
 * @param {req} req - The request.
 * @param {function(err, token)} cb - Callback function.
 */
controller.handlePost = function handlePost(req, cb) {
  if (typeof req.body.business === 'undefined') {
    return cb(errors.noObjectFound('business'));
  }
  const business = req.body.business;
  // Check valid request.
  parser.validProperties(expectedRequests.POST, business, (err) => {
    if (err) {
      return cb(errors.invalidProperties(err.invalidProperty));
    }

    const b = new Business();
    b.email = business.email;
    b.password = hash.hashPassword(business.password).hash; // hash password
    b.name = business.name;
    b.address = business.address;
    b.contactNumber = business.contactNumber;
    b.period = business.period;

    b.insert((error) => {
      if (error) {
        return cb(errors.serverError());
      }
      // Delete password so not attached to token.
      delete b.password;
      // Genearate and pass token.
      try {
        const token = tk.generateToken('business', b);
        return cb(null, token);
      } catch (e) {
        return cb(errors.serverError());
      }
    });
  });
};


