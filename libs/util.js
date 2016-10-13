'use strict';

var shortid = require('shortid');

var util = exports;

util.isValidString = function (string) {
  switch (string) {
    case "":
    case 0:
    case "0":
    case null:
    case false:
    case undefined:
    case typeof this == "undefined":
      return false;
    default:
      return true;
  }
};

/**
 * Determines if an object is an array.
 * @param {object} object - Object to check is an array.
 * @return {boolean} - True: object is an Array, False: object is not an array.
 */
util.isArray = function (object) {
  return Array.isArray(object);
};


/**
 * Generates a unique id.
 * @return {string} unique id.
 * */
util.generateID = function () {
  return shortid.generate();
};


  
