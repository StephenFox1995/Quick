'use strict';
var 
  fs = require('fs'),
  util = require('../../libs/util'),
  sqlite3DB = require('../../models/sqlite3/sqlite3DB');

const argv = require('minimist')(process.argv.slice(2));

// Usage: node config/setup/appSetup.js -f "/Users/stephenfox/Desktop/quick_jwt.db"


(function setupdb(filepath) {
  if (!util.isValidString(filepath)) {
    return console.log('No file path specified.');
  }

  // Check if db exists.
  if (!fs.existsSync(filepath)) {
    var configDirectory = '/etc/quick';
    var configFile = 'config';

    // Make the config directory.
    console.log('Creating /etc/quick');
    try {
      mkdirSync(configDirectory);
    } catch (e) {
      console.log('/etc/quick already exists.');
      return console.log(e);
    }

    // Create the config file and write where the SQLite db is stored.
    var file  = configDirectory + '/' + configFile;
    var contents = JSON.stringify({ "sqliteFilepath" : filepath });

    console.log('Writing database location to configuration file.');
    writeToConfig(file, contents, function (err) {
      if (err) return console.log('There was an error writing to configurations file. ' + err);
      // Config file created successfully, create database.
      sqlite3DB.create(filepath);
      return console.log('Success created database file.');
    });
  }
})(argv.f);




/**
 * Writes contents to a configuration file specified by the filepath.
 * @param   {string} filepath - The filepath of the cofiguration file.
 * @param   {object} contents - The contents to write to the file.
 * @param   {function(err)} callback - Callback
 **/
function writeToConfig(filepath, contents, callback) {
  fs.writeFile(filepath, contents, function (err) {
    callback(err);
  });
}

/**
 * Makes a directory synchronously.
 * @param {string} path - The path to created the directory.
 **/
function mkdirSync(path) {
  try {
    fs.mkdirSync(path);
  } catch(e) {
    if (e.code != 'EEXIST') throw e;
  }
}






