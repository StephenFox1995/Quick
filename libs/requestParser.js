'use strict';

var requestParser = module.exports;

/**
 * Checks properties of an object from request body.
 * @param {object} properties - An object containing a key-value
 * relationship of:
 *       { propertyName: functionToApply }.
 *        - propertyName must be the name of the property that will be checked in the object.
 *        - functionToApply is the function to used to validate the property in the object.
 * 
 * @param {object} object - The object that to check for the properties specified in the previous param.
 * @param {function(err)} cb - Callback function, if error is null then no error ocurred, otherwise error.
 * 
 * So for example, a use case may be:
 *  properties param: 
 *      var propertiesToValidate: {
 *          name: validString,
 *          email: validEmail,
 *          password: validString
 *      }
 * 
 * object param:
 *      var person: {
 *        name: "Stephen Fox",
 *        email: "test@test.com",
 *        password: "strong-password"
 *      }
 * 
 * Therefore for each property in person object, a corresponding function will be used to validate it.
 * E.g. for 'name' the validString function will be called.
 *          'email' the validEmail function will be called etc.
 * 
 * If a property is missing then an Error will be passed in the callback and function will return.
 * 
 * function signatures should adhere to one param with a return value of true or false.
 *  - true: The param was valid.
 *  - false: The param was not valid.
 */
requestParser.validProperties = function(properties, object, cb) {
  if (!object || !properties) { 
    return cb(new Erorr('Invalid function parameters.'));
  }

  var allProperties = Object.keys(properties);
  for (var i = 0; i < allProperties.length; i++) {
    var property = allProperties[i];
    // Check the object has the property.
    if (!(object.hasOwnProperty(property))) {
      var error = new Error('object does not contain property ' + property);
      error.invalidProperty = property;
      return cb(error);
    }
    // Get the function associated with field to check
    // pass the property value from the object to the function.
    var func = properties[property];
    if (typeof func === 'function') {
      // Pass the value of the property.
      // Check if the function returns true.
      // Otherwise: callback with error.
      var value = object[property];  
      if (!func(value)) {
        var error = new Error(property + ' property was not valid');
        error.invalidProperty = property;
        return cb(error);  
      }      
    }
  }
  return cb(null);
};
