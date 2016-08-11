'use strict';

var business = exports;

// Create statement for Business table
business.create = 'CREATE TABLE Business(                 \
                  id                  STRING PRIMARY KEY, \
                  name                STRING,             \
                  address             STRING,             \
                  contact_number      STRING,             \
                  email               STRING,             \
                  password            STRING              \
        );';

// Insert statement for Business table.
business.insert = 'INSERT INTO Business(id, name, address, contact_number, email, password) ' +
  'VALUES(?, ?, ?, ?, ?, ?);';

business.all = 'SELECT id, name, address, contact_number, email FROM Business;';

business.info = 'SELECT id, name, address, contact_number, email  FROM Business WHERE id = ?';

business.getBusiness = 'SELECT id, password FROM Business WHERE email = ?;';