'use strict';

var 
  
  
  mongoose  = require('mongoose'),
  models    = require('../models/mongoose/models')(mongoose),
  hash      = require('../libs/hash');  

/**
 * Business object
 */
function Business() { }


Business.prototype.schema = models.Business;

/**
 * Inserts a business into the database.
 * @param {function(err)} cb - Callback function.
 */
Business.prototype.insert = function (cb) {
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
      return cb(null);
    }
    return cb(err);
  });
};

/**
 * Verifies that the user exists and their password is correct.
 * If the user exists, the properties for the business will be set on an instance.
 * @param   {function(err)} cb - Callback.
 * */
Business.prototype.verify = function (cb) {
  var me = this;
  var email = this.email.toLowerCase();
  var password = this.password;

  this.schema.findOne({email: email}, function(err, business) {
    if (err) { return cb(err); }

    // Assume theres no user in the database
    // with these credentials.
    // This is not classed as a error, more so a incorrect
    // verification attempt.
    if (!business || !('password' in business)) {
      return cb(null, false);
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
 * Gets all businesses in the database.
 * @param   {function(err)} cb - Callback function.
 */
Business.prototype.all = function(cb) {
  this.schema.aggregate([{
    $project: {
      id: "$_id",
      _id: 0,
      email: 1,
      name: 1,
      address: 1,
      contactNumber: 1,
      createdAt: 1, 
    }}
  ], cb);
};


module.exports = Business;