'use strict';

var 
  token   = require('../libs/token'),
  db      = require('../models/database');

var runConfig = exports;


/**
 *  Attempts to set the token secret for the application.
 *  @return {boolean} - True if the token was set, otherwise false.
 */
runConfig.tokenSecret = function () {
  return token.setApplicationTokenSecret();
};


/**
 * Attempts to connect to the database reading from configurations file.
 * @return {boolean} - True if connected successfully.
 */
runConfig.setupDatabase = function () {
  return db.setupMongo();
};