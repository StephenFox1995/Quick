'use strict';
var 
  token = require('./token');

exports.validRequest = function(req, res, next) {
  // Check if token is valid.
  token.validToken(req, function(qRes) {
    if (!qRes.valid) {
      return res
      .status(qRes.code)
      .json(qRes.httpRes);
    }
    next();
  });
};
