'use strict';

const shortid = require('shortid');
const util = exports;

util.isValidString = function (string) {
  console.log('String: ' + string);
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


util.generateID = function () {
  return shortid.generate();
};

module.exports = util;
  
