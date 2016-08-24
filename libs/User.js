'use strict';

var 
  util = require('./util'),
  db = require('../models/database'),
  hash = require('../libs/hash');


function User() { }

/**
 * Parses a JSON object from a POST request.
 * @param   {object} req - The request.
 * @param   {function(err)} cb - Callback function.
 * @return  {undefined}
 * */
User.prototype.parsePOST = function(req, cb) {
  if (validRequest(req)) {
    this.setAttributesFromRequest(req);
    return cb(null);
  } else {
    return cb(new Error('Could not parse user.'));
  }
};


/**
 * A helper function to insert the current user object into the database.
 * @param   {function(err)} cb - Callback
 **/
User.prototype.insert = function (cb) {
  db.insertUser(this, cb);
};


User.prototype.getPurchases = function (userID, callback) {
  db.getUserPurchases(userID, callback);
};


/**
 * Verifies that the user exists and their password is correct.
 * @param   {function(err)} cb - Callback.
 * */
User.prototype.verify = function (cb) {
  var me = this;
  var email = this.email;
  var password = this.password;

  // Check the user actually exists in the database
  // and if so, returns they're details.
  db.getUser(email, function (err, userInfo) {
    if (err) {
      return cb(err);
    }
    
    // Compare hashed password with normal password.
    if (hash.compare(password, userInfo.password, function (err, verified) {
      if (err) {
        cb(err);
      } else {
        if (verified) {
          // As verification was successful
          // add id, firstname etc.
          me.id = userInfo.id;
          me.firstname = userInfo.firstname;
          me.lastname = userInfo.lastname;
          return cb(null, true);
        } else {
          cb(null, false);
        }
      }
    }));
  });
};

/**
 * Sets the attributes of the user object based on
 * the requests properties.
 * @param   {Object} req - The request.
 */
User.prototype.setAttributesFromRequest = function(req) {
  var user = req.body.user;
  this.firstname = user.firstname;
  this.lastname = user.lastname;
  this.password = user.password;
  this.email = user.email;
};

/**
 * Checks if a req is valid.
 * The request is deemed valid if the 
 * body contains a user object with the correct fields.
 * @param {Object} req The request.
 * @return {boolean} True if the req is valid.
 */
function validRequest(req) {
  if (!'user' in req.body){
    return false;    
  }
  var user = req.body.user;
  if (util.isValidString(user.firstname) &&
      util.isValidString(user.lastname)  &&
      util.isValidString(user.email)     &&
      util.isValidString(user.password)) {
    return true;
  } else {
    return false;
  }
}


module.exports = User;