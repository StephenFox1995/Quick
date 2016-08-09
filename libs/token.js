'use strict';

var httpCodes = require('./httpCodes'),
    jwt       = require('jsonwebtoken'),
    ms        = require('ms');

var token = exports;

const secret = 'SOME_SECRET';



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
  token.parseAuthHeaderToken(req, function (token) {
    if (token) {
      jwt.verify(token, secret, function (err, decoded) {
        if (err) {
          return res.json({ success:false, responseMessage: "Failed to authenticate token. Reason: " + err.message });
        }
        req.decoded = decoded;
        next();
      });
    }
    else {
      return res.json({ success:false, responseMessage: "No token provided." });
    }
  });
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
