'use strict';

var httpCodes = require('./httpCodes'),
    jwt       = require('jsonwebtoken'),
    ms    = require('ms');

var auth = exports;

const secret = 'SOME_SECRET';

auth.parseAuthHeader = function (req) {
  var bearerToken = null;
  var bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    var bearer = bearerHeader.split(' ');
    bearerToken = bearer[1];
    req.token = bearerToken;
    return true;
  } else {
    return false;
  }
};


/**
 * Validates a JWT token.
 * If the token is valid next() will ve called;
 * If the token is not valid a reponse will be sent.
 * */
auth.validToken = function (req, res, next) {
  if (auth.parseAuthHeader(req)) {
    jwt.verify(req.token, secret, function (err, decoded) {
      console.log(Math.floor(Date.now() / 1000));
      if (err) {
        console.log(err);
        return res.json({ success:false, responseMessage: "Failed to authenticate token" });
      }
      req.decoded = decoded;
      next();
    });
  }
  else {
    return res.json({ success:false, responseMessage: "No token provided." });
  }
};



/**
 * Generates a JSON Web Token, with the object argument.
 * @param object The object to generate the token for.
 *
 * @returns {Object} token            - A token object.
 * @returns {string} token.value      - The token generated.
 * @returns {string} token.expiresIn  - The expiration time of the token.
 * */
auth.generateToken = function (object) {
  // Generate expiration time for token.
  var expires = ms('1m');
  var token = jwt.sign(object, secret, { expiresIn: expires });
  return {
    value: token,
    expiresIn: expires
  };
};



auth.verifyToken = function (token, callback) {
  jwt.verify(token, secret, function (err, decoded) {
    if (err) {return callback(err);}

    // Verify the token hasn't expired.
    if (!auth.hasTokenExpired(decoded)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  });
};
