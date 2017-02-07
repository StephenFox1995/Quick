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

util.isNumber = function(type) {
  return typeof(type) === 'number';
};

/**
 * Determines if an object is an array.
 * @param {object} type - Type to check is an array.
 * @return {boolean} - True: object is an Array, False: object is not an array.
 */
util.isArray = function (type) {
  return Array.isArray(type);
};

/**
 * Determines if type is object
 * @param {object} type - Type to check is an object.
 * @return {boolean} - True: type is an object, False: object is not an object.
 */
util.isObject = function(type) {
  return typeof(type) === 'object';
};


/**
 * Generates a unique id.
 * @return {string} unique id.
 * */
util.generateID = function () {
  return shortid.generate();
};


  
