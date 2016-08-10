'use strict';

var httpCodes = require('./httpCodes'),
    jwt       = require('jsonwebtoken'),
    ms        = require('ms'),
    globals   = require('../libs/globals'),
    fs        = require('fs');

var token = exports;

// The secret for the token.
var secret = null;

// TODO: Look into parsing token elsewhere, not just from HTTP header.


/***
 * Parses HTTP headers for the authorization header value.
 *
 * @param req
 *
 * @param {function(string|null)} cb - If successfully parsed the token will be passed
 *                                     via the callback, otherwise null.
 */
token.parseAuthHeaderToken = function (req, cb) {
  var bearerToken = null;
  var bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    var bearer = bearerHeader.split(' ');
    bearerToken = bearer[1];
    cb(bearerToken);
  } else {
    cb(null);
  }
};


/**
 * Validates a JWT token.
 * If the token is valid next() will ve called;
 * If the token is not valid a response will be sent.
 * */
token.validToken = function (req, res, next) {
  token.parseAuthHeaderToken(req, function (tk) {
    if (tk) {
      jwt.verify(tk, secret, function (err, decoded) {
        if (err) {
          return res.json({
            success:false,
            responseMessage: "Failed to authenticate token. Reason: " + err.message
          });
        }
        req.decoded = decoded;
        next();
      });
    }
    else {
      return res.json({ success: false, responseMessage: "No token provided." });
    }
  });
};



token.renew = function (token, cb) {
  jwt.verify(tk, secret, function (err, decoded) {
    if (!err) {
      // No error with the token, therefore it cannot be renewed.
      return cb(new Error().message = "Token cannot be renewed as it is still valid.");
    }
  })
};


/**
 * Generates a JSON Web Token, with the object argument.
 * @param object The object to generate the token for.
 *
 * @returns {Object} token            - A token object.
 * @returns {string} token.value      - The token generated.
 * @returns {string} token.expiresIn  - The expiration time of the token.
 * */
token.generateToken = function (object) {
  // Generate expiration time for token.
  var expires = ms(ms('10 hours'));
  var token = jwt.sign(object, secret, { expiresIn: expires });
  return {
    value: token,
    expiresIn: expires
  };
};


/**
 * Attempts to set the token secret for the application.
 *
 * @returns {boolean} - True if the token was set, otherwise false.
 */
token.setApplicationTokenSecret = function () {
  var tokenSecretFile;
  try {
    tokenSecretFile = fs.readFileSync(globals.Globals.tokenSecret, 'utf8');
  } catch (e) {
    console.log(e);
    if (e.code === 'ENOENT') {
      console.log('Could not find tokenSecret file.');
      return false;
    }
  }

  // Parse the token from the file.
  var fileContents = JSON.parse(tokenSecretFile);
  if (fileContents) {
    // Set the token secret
    secret = fileContents.tokenSecret;
    return true;
  } else {
    console.log('Could not find token secret in file.');
    return false;
  }
};
