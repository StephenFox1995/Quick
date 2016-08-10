'use strict';

var token   = require('../libs/token'),
    db      = require('../models/database');

var runConfig = exports;


/**
 *  Attempts to set the token secret for the application.
 *  @returns {boolean} - True if the token was set, otherwise false.
 */
runConfig.tokenSecret = function () {
  return token.setApplicationTokenSecret();
};


/**
 * Attempts to locate the sqlite3DB file and set in configurations.
 * @returns {boolean} - True if the sqlite3DB was located and value
 *                      set in configurations; otherwise false.
 */
runConfig.locateDatabase = function () {
  return db.locate();
};