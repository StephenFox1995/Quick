'use strict';
var 
  fs = require('fs'),
  util = require('../../libs/util'),
  userSQL = require('../../models/sqlite3/userSQL'),
  businessSQL = require('../../models/sqlite3/businessSQL'),
  productSQL = require('../../models/sqlite3/productSQL'),
  purchaseSQL = require('../../models/sqlite3/purchaseSQL');

const argv = require('minimist')(process.argv.slice(2));

// Usage: node config/setup/dbGen.js -f "/Users/stephenfox/Desktop/quick_jwt.db"


(function setupdb(filepath) {
  if (!util.isValidString(filepath)) {
    return console.log('No file path specified.');
  }

  // Check if db exists.
  if (!fs.existsSync(filepath)) {
    var configDirectory = '/etc/quick';
    var configFile = 'config';

    // Make the config directory.
    try {
      console.log('Creating /etc/quick');
      mkdirSync(configDirectory);
    } catch (e) {
      console.log('/etc/quick already exists.');
      return console.log(e);
    }

    // Create the config file and write where the SQLite db is stored.
    var file  = configDirectory + '/' + configFile;
    var contents = JSON.stringify({ "sqliteFilepath" : filepath });

    console.log('Writing sqlite3DB location to configuration file.');
    writeToConfig(file, contents, function (err) {
      if (err) return console.log('There was an error writing to configurations file. ' + err);
      // Config file created successfully, create sqlite3DB.
      createSQLiteDatabase(filepath);
      return console.log('Success created sqlite3DB file.');
    });
  }
})(argv.f);



function createSQLiteDatabase(location) {
  var sqlite3 = require('sqlite3').verbose();
  var db = new sqlite3.Database(location);
  db.serialize(function () {
    // Create User table.
    db.run(userSQL.create);
    db.run(businessSQL.create);
    db.run(productSQL.create);
    db.run(purchaseSQL.create);
  });
}

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






