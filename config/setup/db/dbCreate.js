var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var os = require('../../os');
var createStmts = require('./create');
var argv = require('minimist')(process.argv.slice(2));


var db;
var configDirectory = '/etc/quick';
var configFile = 'config';

// Get the filepath for the database pass in via command line.
var filepath = argv.f;


if (filepath === undefined) {
  console.log('No filepath specified.');
  return;
}


// Check if db exists.
if (!fs.existsSync(filepath)) {
  mkdirSync(configDirectory);
  // Add filepath to config file on system.
  writeToConfig(JSON.stringify({"sqliteFilepath": filepath}));

  db = new sqlite3.Database(filepath);
  db.serialize(function () {
    // Create User table.
    db.run(createStmts.getCreateUserTableStatement());
  });
}


function writeToConfig(contents) {
  fs.writeFile(configDirectory + configFile, contents, function (err, data) {
    if (err) {
      return console.log(err);
    }
    return console.log(data);
  });
}

var mkdirSync = function (path) {
  try {
    fs.mkdirSync(path);
  } catch(e) {
    if ( e.code != 'EEXIST' ) throw e;
  }
}






