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
User.prototype.parsePOST = function(request, parsed, failed) {
  var user = request.body.user;
  var firstname = user.firstname;
  var lastname = user.lastname;
  var password = user.password;
  var email = user.email;

  // Check if any field are missing.
  if (util.isValidString(firstname) &&
      util.isValidString(lastname) &&
      util.isValidString(email) &&
      util.isValidString(password)) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.password = password;
    this.email = email;
    parsed(this);
  } else {
    failed("Could not parse user.");
  }
};


/**
 * A helper function to insert the current user object into the database.
 **/
User.prototype.insert = function () {
  db.insertUser(this);
};


module.exports = User;

