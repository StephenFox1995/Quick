const shortid = require('shortid');

const util = exports;

util.isValidString = (string) => {
  switch (string) {
    case '':
    case 0:
    case '0':
    case null:
    case false:
    case undefined:
    case typeof string === 'undefined':
      return false;
    default:
      return true;
  }
};

util.isNumber = type => typeof type === 'number';

/**
 * Determines if an object is an array.
 * @param {object} type - Type to check is an array.
 * @return {boolean} - True: object is an Array, False: object is not an array.
 */
util.isArray = type => Array.isArray(type);

/**
 * Determines if type is object
 * @param {object} type - Type to check is an object.
 * @return {boolean} - True: type is an object, False: object is not an object.
 */
util.isObject = type => typeof type === 'object';

/**
 * Generates a unique id.
 * @return {string} unique id.
 * */
util.generateID = () => shortid.generate();

/**
 * Generates a url for accessing geocoding API.
 */
util.geocodeURL = (address) => {
  const gmapsKey = process.env.GMAPS_KEY;
  const addressWithSpaces = address.replace(/\s/, '+');
  return `https://maps.googleapis.com/maps/api/geocode/json?address=${addressWithSpaces}&key=${gmapsKey}`;
};
