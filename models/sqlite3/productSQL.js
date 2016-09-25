'use strict';

var product = exports;

// Create statement for Product table
product.create = 'CREATE TABLE Product(' +
  'id                  STRING PRIMARY KEY, ' +
  'specifiedID         STRING, ' +
  'businessID          STRING, ' +
  'name                STRING, ' +
  'price               FLOAT, ' +
  'description         STRING, ' +
  'options             STRING,' + 
  'timestamp           TEXT,' +            
  'FOREIGN KEY(businessID) REFERENCES business(id))';



product.insert = 'INSERT INTO Product(id, specifiedID, name, price, description, businessID, options, timestamp)' +
'VALUES(?, ?, ?, ?, ?, ?, ?, ?)';


product.getProduct = 'SELECT * FROM Product WHERE id = ?';

product.getAllBusinessProducts = 'SELECT * FROM Product WHERE businessID = ?';

