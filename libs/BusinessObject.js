'use strict';

var 
  date = require('date-and-time'),
  util = require('./util');



function BusinessObject() {}

BusinessObject.prototype.setCreationTime = function() {
  var now = new Date();
  this.timestamp = date.format(now, 'YYYY-MM-DD HH:mm:ss');
};


/**
 * Ensures all the objects are present within the request body.
 * For example, use this request to ensure that a HTTP body
 * contains a Product object. If request doesn't contain a body
 * property then false will be returned.
 * @param {array} objects - All the fields to check each field
 *                         must be passed as a string.
 * @param {object} req - The req.
 * @return {boolean} - True: The request contains the objects, else false.
 */
BusinessObject.prototype.requestContainsObjects = function(objects, req) {
  if ('body' in req) {
    for (var i = 0; i < objects.length; i++) {
      if (!(objects[i] in req.body)) {
        return false;
      } else {
        return true;
      }
    }
  } else {
    return false;
  }
};


/**
 * Ensures all properties passed are valid strings.
 * Use this function for requests that need to contain specific
 * info like names, passwords etc... The request should not have
 * empty fields for these properties.
 * @param {array} array - An array containing all properties to be 
 *                        checked for valid strings.
 * @return {boolean} - True if all properties are valid string, else false.
 */
BusinessObject.prototype.validStrings = function(array) {
  for (var i = 0; i < array.length; i++) {
    if (!util.isValidString(array[i])) {
      return false;
    }
  }
  return true;
};


module.exports = BusinessObject;