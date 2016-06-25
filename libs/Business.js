'use strict';

const util = require('./util');
const db = require('../models/database');

function Business() { }


Business.prototype.parsePOST = function (req, callback) {
  // Get the Business object from request.
  var business = req.body;

  // Check if valid business object.
  if (isValidBusinessObject(business)) {
    this.name = business.name;
    this.address = business.address;
    this.contactNumber = business.contactNumber;
    this.email = business.email;
    this.password = business.password;
    callback(null);
  } else {
    callback(new Error('Could not parse user.'));
  }
};


Business.prototype.insert = function (callback) {
  db.insertBusiness(this, callback);
};


/**
 * Determines that the Business object is valid
 * by checking that all fields have a value.
 **/
function isValidBusinessObject(business) {
  if (util.isValidString(business.name)           &&
      util.isValidString(business.address)        &&
      util.isValidString(business.contactNumber)  &&
      util.isValidString(business.email)          &&
      util.isValidString(business.password)) {
    return true;
  } else {
    return false;
  }
}

module.exports = Business;