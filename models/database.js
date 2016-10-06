'use strict';

var 
  fs        = require('fs'),
  globals   = require('../libs/globals'),
  mongoose  = require('mongoose');

var database = exports;

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
  var mongoDetails = JSON.parse(configFileContents).mongodb;
  if (mongoDetails) {
    globals.Globals.mongoDetails = {};
    globals.Globals.mongoDetails.port = mongoDetails.port;
    globals.Globals.mongoDetails.uri = mongoDetails.uri;
    globals.Globals.mongoDetails.database = mongoDetails.database;

    // Create Mongo url from config file.
    var url = 'mongodb://' + mongoDetails.uri + ':' + mongoDetails.port + '/' + mongoDetails.database;
    mongoose.connect(url);

    // CONNECTION EVENTS
    // When successfully connected
    mongoose.connection.on('connected', function () {  
      console.log('Mongoose default connection open to ' + url);
      callback(null);
    }); 

    // If the connection throws an error
    mongoose.connection.on('error', function (err) {  
      console.log('Mongoose default connection error: ' + err);
      callback(err);
    }); 

    // When the connection is disconnected
    mongoose.connection.on('disconnected', function () {  
      console.log('Mongoose default connection disconnected'); 
    });
  } else {
    console.log('Configuration file does not contain MongoDB details.');
    return false;
  }
};


