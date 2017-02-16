const mongoose = require('mongoose');
const models = require('../models/mongoose/models')(mongoose);
const hash = require('../libs/hash');
const util = require('../libs/util');
const request = require('request');
/**
 * Business object
 */
function Business() { }


Business.prototype.Schema = models.Business;

/**
 * Inserts a business into the database.
 * @param {function(err)} cb - Callback function.
 */
Business.prototype.insert = function (cb) {
  const business = new this.Schema({
    email: this.email.toLowerCase(),
    password: this.password,
    name: this.name,
    address: this.address,
    contactNumber: this.contactNumber,
    coordinates: null,
    period: this.period,
  });

  // Before inserting geocode the businesses address.
  const geocodeURL = util.geocodeURL(this.address);
  const me = this; // Keep context.
  request(geocodeURL, (err, response, body) => {
    const data = JSON.parse(body);
    if ('geometry' in data.results[0]) {
      if ('location' in data.results[0].geometry) {
        const coordinates = data.results[0].geometry.location;
        business.coordinates = coordinates;
        business.save((error, result) => {
          if (error) {
            cb(err);
          } else {
            me.id = result._id.toHexString();
            cb(null);
          }
        });
      }
    } else {
      cb(new Error('Invalid Address given'));
    }
  });
};

/**
 * Verifies that the user exists and their password is correct.
 * If the user exists, the properties for the business will be set on an instance.
 * @param   {function(err)} cb - Callback.
 * */
Business.prototype.verify = function (cb) {
  const me = this;
  const email = this.email.toLowerCase();
  const password = this.password;

  this.Schema.findOne({ email }, function(err, business) {
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
  this.Schema.aggregate([{
    $project: {
      id: '$_id',
      _id: 0,
      email: 1,
      name: 1,
      address: 1,
      contactNumber: 1,
      createdAt: 1,
    },
  }], cb);
};

module.exports = Business;
