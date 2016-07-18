'use strict';

var shortid = require('shortid'),
    util = exports;

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
 * Generates a unique id.
 * */
util.generateID = function () {
  return shortid.generate();
};

  
