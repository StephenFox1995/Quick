'use strict';

var util = require('./util');
var user = exports;

/**
 * Parses a JSON object from a POST request.
 * Parses the following:
 *  - first name
 *  - last name
 *  - password
 * */
user.parsePOST = function(request, parsed, failed) {
  var user = request.body.user;
  var firstname = user.firstname;
  var lastname = user.lastname;
  var password = user.password;

  // Check if any field are missing.
  if (util.isValidString(firstname) ||
      util.isValidString(lastname)  ||
      util.isValidString(password)) {
    failed("Could not parse user.");
  } else {
    parsed(user);
  }
};