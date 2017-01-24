'use strict';

var 
  fs        = require('fs'),
  globals   = require('../libs/globals'),
  mongoose  = require('mongoose'),
  util      = require('util');

var database = exports;

function connString(uri, port, database, user=undefined, password=undefined) {
  if (user === 'undefined' && password == 'undefined') {
    return util.format("mongodb://%s:%s/%s", uri, port, database);
  }
  return util.format("mongodb://%s:%s@%s:%s/%s", user, password, uri, port, database);
}

database.setupMongo = function(callback) {
  var configFileContents;
  try {
    configFileContents = fs.readFileSync(globals.Globals.configFile, 'utf8');
  } catch (e) {
    if (e.code === 'ENOENT') {
      console.log('Could not find configurations file.');
      return false;
    }
  }

  // Get the Mongo details.
  var mongoDetails = JSON.parse(configFileContents).databases[0];
  if (mongoDetails) {
    globals.Globals.mongoDetails = {};
    globals.Globals.mongoDetails.port = mongoDetails.port;
    globals.Globals.mongoDetails.uri = mongoDetails.uri;
    globals.Globals.mongoDetails.database = mongoDetails.database;

    // Create Mongo url from config file.
    var user = mongoDetails.username || undefined;
    var password = mongoDetails.password || undefined;

    var cString = connString(mongoDetails.uri, mongoDetails.port, mongoDetails.database, user, password);
    mongoose.connect(cString);

    // CONNECTION EVENTS
    // When successfully connected
    mongoose.connection.on('connected', function () {  
      console.log('MongoDB connection open');
      callback(null);
    }); 

    // If the connection throws an error
    mongoose.connection.on('error', function (err) {  
      console.log('MongoDB connection error ' + err);
      callback(err);
    }); 

    // When the connection is disconnected
    mongoose.connection.on('disconnected', function () {  
      console.log('MongoDB connection disconnected'); 
    });
  } else {
    console.log('Configuration file does not contain MongoDB details.');
    callback(new Error('Configuration file does not contain MongoDB details.'));
  }
};




