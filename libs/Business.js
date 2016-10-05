'use strict';

var 
  util  = require('./util'),
  db    = require('../models/database'),
  hash  = require('../libs/hash'),
  mongoose  = require('mongoose'),
  models    = require('../models/mongoose/models')(mongoose),
  hash      = require('../libs/hash');  

/**
 * Business object
 */
function Business() { }


Business.prototype.schema = models.Business;


Business.prototype.parsePOST = function (req, cb) {
  if (validRequest(req)) {
    this.setAttributesFromRequest(req);
    return cb(null);
  } else {
    return cb(new Error('Could not parse business'));
  }
};


Business.prototype.insert = function (cb) {
  // Hash password
  var hashed = hash.hashPassword(this.password);
  // Set the business hashed password.
  this.password = hashed.hash;

  var business = new this.schema({
    email: this.email.toLowerCase(),
    password: this.password,
    name: this.name,
    address: this.address,
    contactNumber: this.contactNumber
  });

  var me = this; // Keep context.
  business.save(function(err, business) {
    if (business) {
      me.id = business._id.toHexString();
      delete me.password;
    }
    return cb(err);
  });
};


Business.prototype.verify = function (cb) {
  var me = this;
  var email = this.email;
  var password = this.password;

  this.schema.findOne({email: email}, function(err, business) {
    if (err) { return cb(err); }

    if (!business || !('password' in business)) {
      return cb(new Error('No business for email: ' + email + ' exists.'));
    }
    
    // Compare hashed and plaintext password.
    hash.compare(password, business.password, function(err, verified) {
      // Remove password from the business object.
      delete me.password;

      if (err) { return cb(err, false); }

      if (verified) {
        me.id = business._id;
        me.email = business.email;
        me.name = business.name;
        me.address = business.address;
        me.contactNumber = business.contactNumber;
        return cb(null, true);
      } else {
        return cb(null, false);
      }
    });
  });
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
  if (!('business' in req.body)) {
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




module.exports = Business;