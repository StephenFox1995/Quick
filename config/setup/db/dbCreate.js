var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var os = require('../../os');
var createStmts = require('./create');
var argv = require('minimist')(process.argv.slice(2));


var db;
var configDirectory = '/etc/quick';
var configFile = 'config';

// Get the file path for the database pass in via command line.
var filepath = argv.f;


if (filepath === undefined) {
  console.log('No file path specified.');
  return;
}


// Check if db exists.
if (!fs.existsSync(filepath)) {
  // Make the config directory.
  try {
    mkdirSync(configDirectory);
  } catch (e) {
    console.log(e);
  }

  // Create the config file and write where the SQLite db is stored.
  var file  = configDirectory + '/' + configFile;
  writeToConfig(file, JSON.stringify({ "sqliteFilepath": filepath }));

  // db = new sqlite3.Database(filepath);
  // db.serialize(function () {
  //   // Create User table.
  //   db.run(createStmts.getCreateUserTableStatement());
  // });
}


function writeToConfig(filepath, contents) {
  fs.writeFile(filepath, contents, function (err) {
    if (err) {
      return console.log(err);
    }
  });
}

function mkdirSync(path) {
  try {
    fs.mkdirSync(path);
  } catch(e) {
    if (e.code != 'EEXIST') throw e;
  }
}






