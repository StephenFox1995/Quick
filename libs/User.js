'use strict';

var util = require('./util'),
    db = require('../models/database'),
    hash = require('../libs/hash');


function User() { }

/**
 * Parses a JSON object from a POST request.
 * Parses the following:
 *  - first name
 *  - last name
 *  - password
 * */
User.prototype.parsePOST = function(req, callback) {
  var user = req.body;

  // Check if any fields are missing or incorrect.
  if (isValidUserObject(user)) {
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.password = user.password;
    this.email = user.email;
    callback(null);
  } else {
    callback(new Error('Could not parse User.'));
  }
};


/**
 * A helper function to insert the current user object into the database.
 **/
User.prototype.insert = function (callback) {
  db.insertUser(this, callback);
};


/**
 * Verifies that the user exists and their password is correct.
 * */
User.prototype.verify = function (callback) {
  var email = this.email;
  var password = this.password;

  // Check the user actually exists in the database.
  // TODO: Handle when a user's email address doesn't
  // exist in the database.
  db.getUser(email, function (err, userInfo) {
    if (err) {
      callback(err);
    }

    // Compare hashed password with normal password.
    if (hash.compare(password, userInfo.password, function (err, verified) {
        if (err) {
          callback(err);
        } else {
          if (verified) {
            callback(null, true);
          } else {
            callback(null, false);
          }
        }
      }));
  });
};


function isValidUserObject(user) {
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

