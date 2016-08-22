'use strict';

var product = exports;

// Create statement for Product table
product.create = 'CREATE TABLE Product(' +
  'id                  STRING PRIMARY KEY, ' +
  'businessID          STRING, ' +
  'name                STRING, ' +
  'price               STRING, ' +
  'description         STRING, ' +
  'FOREIGN KEY(businessID) REFERENCES business(id))';



product.insert = 'INSERT INTO Product(id, name, price, description, businessID)' +
'VALUES(?, ?, ?, ?, ?)';


product.getProduct = 'SELECT * FROM Product WHERE id = ?';

product.getAllBusinessProducts = 'SELECT * FROM Product WHERE businessID = ?';

