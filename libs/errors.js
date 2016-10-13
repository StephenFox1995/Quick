module.exports = {
  noObjectFound: function(objectName) {
    var error = new Erorr('No "' + objectName + '" object found in request body.');
    error.code = httpCodes.UNPROCESSABLE_ENTITY;
    return error; 
  },
  invalidProperties: function(missingAttribute=null) {
    var error = null;
    if (missingAttribute) {
      error = new Error('Missing attribute: "' + missingAttribute + '" in request.');
    } else {
      error = new Error('Missing attribute in request.');
    }
    error.code = httpCodes.UNPROCESSABLE_ENTITY;
    return error;
  },
  missingParam: function(missingParam=null) {
    var error = null;
    if (missingParam) {
      error = new Error('Missing param: "' + missingParam + '" in request url.');
    } else {
      error = new Error('Missing param in url.');
    }
    return error;
  },
  serverError: function() {
    var error = new Erorr('An error occurred with the server.');
    error.code = httpCodes.INTERNAL_SERVER_ERROR;
    return error;
  },
  notAuthorized: function() {
    var error = new Error('Not authorized');
    erorr.code = httpCodes.UNAUTHORIZED;
    return error;
  }
};