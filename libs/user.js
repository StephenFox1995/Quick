'use strict';

const util = require('./util');
const db = require('../models/database');


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
    callback(new Error('Could not parse user.'));
  }
};


/**
 * A helper function to insert the current user object into the database.
 **/
User.prototype.insert = function (callback) {
  db.insertUser(this, callback);
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

