'use strict';

var util  = require('./util'),
    db    = require('../models/database'),
    hash  = require('../libs/hash');

function Business() { }


Business.prototype.parsePOST = function (req, callback) {
  if (validRequest(req) && isValidBusinessObject(req.body.business)) {
    var business = req.body.business;
    this.name = business.name;
    this.address = business.address;
    this.contactNumber = business.contactNumber;
    this.email = business.email;
    this.password = business.password;
    callback(null);
  } else {
    callback(new Error('Could not parse Business.'));
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

function validRequest(req) {
  return req.body.business ? true: false;
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
          callback(err);
        } else {
          if (verified) {
            // Once verified set the rest
            // of the info about the business.
            me.id = businessInfo.id;
            me.address = businessInfo.address;
            me.name = businessInfo.name;
            me.contactNumber = businessInfo.contactNumber;
            callback(null, true);
          } else {
            callback(null, false);
          }
        }
      }));
  });

};

module.exports = Business;