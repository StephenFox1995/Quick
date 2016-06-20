var fs = require('fs');
var os = require('../../os');
var createStmts = require('./create');
var argv = require('minimist')(process.argv.slice(2));


// Get the file path for the database pass in via command line.
var filepath = argv.f;


if (filepath === undefined) {
  console.log('No file path specified.');
  return;
}


// Check if db exists.
if (!fs.existsSync(filepath)) {
  var configDirectory = '/etc/quick';
  var configFile = 'config';

  // Make the config directory.
  try {
    mkdirSync(configDirectory);
  } catch (e) {
    console.log(e);
  }

  // Create the config file and write where the SQLite db is stored.
  var file  = configDirectory + '/' + configFile;
  var contents = JSON.stringify({ "sqliteFilepath" : filepath });
  writeToConfig(file, contents, function (err) {
    if (err) return console.log(err);
    // Config file created successfully, create database.
    createSQLiteDatabase(filepath);
  });
}


function createSQLiteDatabase(location) {
  var sqlite3 = require('sqlite3').verbose();
  var db = new sqlite3.Database(filepath);
  db.serialize(function () {
    // Create User table.
    db.run(createStmts.getCreateUserTableStatement());
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






