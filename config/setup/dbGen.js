'use strict';
const fs = require('fs');
const util = require('../../libs/util');
const userSQL = require('../../models/userSQL');
const businessSQL = require('../../models/businessSQL');
const productSQL = require('../../models/productSQL');
const purchaseSQL = require('../../models/purchaseSQL');

const argv = require('minimist')(process.argv.slice(2));


// Get the file path for the database pass in via command line.
var filepath = argv.f;

(function setupdb() {
  if (util.isValidString(filepath)) {
    console.log('No file path specified.');
    return;
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
      console.log(e);
    }

    // Create the config file and write where the SQLite db is stored.
    var file  = configDirectory + '/' + configFile;
    var contents = JSON.stringify({ "sqliteFilepath" : filepath });

    console.log('Writing database location to configuration file.');
    writeToConfig(file, contents, function (err) {
      if (err) return console.log('There was an error writing to configurations file. ' + err);
      // Config file created successfully, create database.
      createSQLiteDatabase(filepath);
      console.log('Success created database file.');
    });
  }
})();



function createSQLiteDatabase(location) {
  var sqlite3 = require('sqlite3').verbose();
  var db = new sqlite3.Database(filepath);
  db.serialize(function () {
    // Create User table.
    db.run(userSQL.create);

    // Create Business table.
    db.run(businessSQL.create);

    // Create Prodcut table
    db.run(productSQL.create);

    // Create Purchase table
    db.run(purchaseSQL.create);
  });
}

/**
 * Writes contents to a config file.
 * */
function writeToConfig(filepath, contents, callback) {
  fs.writeFile(filepath, contents, function (err) {
    callback(err);
  });
}

/**
 * Makes a directory synchronously.
 * */
function mkdirSync(path) {
  try {
    fs.mkdirSync(path);
  } catch(e) {
    if (e.code != 'EEXIST') throw e;
  }
}






