'use strict';

var 
  mongoose  = require('mongoose'),
  models    = require('../models/mongoose/models')(mongoose),
  hash      = require('../libs/hash');


/**
 * The User object is the goto object
 * for all user interactions with the system.
 * e.g. 
 *  - parsing user network requests,
 *  - for CRUD operations with the database etc.
 */
function User() { }


/**
 * A User has a schema which is used internally for operations with the database.
 */
User.prototype.schema = models.User;



/**
 * A helper function to insert the current user object into the database.
 * @param   {function(err)} cb - Callback
 **/
User.prototype.insert = function (cb) {
  var user = new this.schema({
    email: this.email.toLowerCase(),
    firstname: this.firstname,
    lastname: this.lastname,
    password: this.password
  });

  var me = this; // Keep context.
  user.save(function(err, user) {
    if (user) {
      // Set the id for the user, by converting
      // the id to a hex string.
      me.id = user._id.toHexString();
      // Remove the password, from the user object.
      delete me.password;
    }
    return cb(err);
  });
};



/**
 * Verifies that the user exists and their password is correct.
 * If the user exists, the properties for the user will be set on an instance.
 * @param   {function(err)} cb - Callback.
 * */
User.prototype.verify = function (cb) {
  var me = this;
  var email = this.email.toLowerCase();
  var password = this.password;

  this.schema.findOne({email: email}, function(err, user) {
    if (err) { return cb(err); }
    
    // Assume theres no user in the database
    // with these credentials.
    // This is not classed as a error, more so a incorrect
    // verification attempt.
    if (!user || !('password' in user)) {
      return cb(null, false);
    }

    // Compare hashed and plaintext password.
    hash.compare(password, user.password, function (err, verified) {
      // Remove password from user object.
      delete me.password;

      if (err) { return cb(err, false); }
      
      if (verified) {
        me.id = user._id;
        me.firstname = user.firstname;
        me.lastname = user.lastname;
        return cb(null, true);
      } else {
        return cb(null, false);
      }
    });
  });
};


module.exports = User;