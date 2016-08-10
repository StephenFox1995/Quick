'use strict';

var product = exports;

// Create statement for Orders table
product.create = 'CREATE TABLE Product(                     \
                  id                  STRING PRIMARY KEY, \
                  business_id         STRING,             \
                  name                STRING,             \
                  price               STRING,             \
                  description         STRING,             \
                  FOREIGN KEY(business_id) REFERENCES business(id))';


product.insert = 'INSERT INTO Product(id, name, price, description, business_id)' +
'VALUES(?, ?, ?, ?, ?)';


product.getProduct = 'SELECT * FROM Product WHERE id = ?';

product.getAllBusinessProducts = 'SELECT * FROM Product WHERE business_id = ?';

