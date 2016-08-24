'use strict';

var 
  util  = require('./util'),
  db    = require('../models/database'),
  hash  = require('../libs/hash');

/**
 * Business object
 */
function Business() { }


Business.prototype.parsePOST = function (req, callback) {
  if (validRequest(req)) {
    this.setAttributesFromRequest(req);
    return callback(null);
  } else {
    return callback(new Error('Could not parse Business'));
  }
};


Business.prototype.insert = function (callback) {
  db.insertBusiness(this, callback);
};

/**
 * Sets the attributes of the user object based on
 * the requests properties.
 * @param   {object} req - The request.
 */
Business.prototype.setAttributesFromRequest = function(req) {
  var business = req.body.business;
  this.id = business.id;
  this.name = business.name;
  this.address = business.address;
  this.email = business.email;
  this.contactNumber = business.contactNumber;
  this.password = business.password;
};

/**
 * Checks if a req is valid.
 * The request is deemed valid if the 
 * body contains a business object with the correct fields.
 * @param {Object} req The request.
 * @return {boolean} True if the req is valid.
 */
function validRequest(req) {
  if (!'business' in req.body) {
    return false;
  }
  var business = req.body.business;
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


Business.prototype.verify = function (callback) {
  var me = this;
  var email = this.email;
  var password = this.password;

  // Check the business actually exists in the database.
  // TODO: Handle when a business email address doesn't
  // exist in the database.
  db.getBusiness(email, function (err, businessInfo) {
    if (err) {
      callback(err);
    }

    // Compare hashed password with normal password
    if (hash.compare(password, businessInfo.password, function (err, verified) {
      if (err) {
        return callback(err);
      } else {
        if (verified) {
          // Once verified set the rest
          // of the info about the business.
          me.id = businessInfo.id;
          me.address = businessInfo.address;
          me.name = businessInfo.name;
          me.contactNumber = businessInfo.contactNumber;
          return callback(null, true);
        } else {
          callback(null, false);
        }
      }
    }));
  });
};

module.exports = Business;