'use strict';

var orders = exports;

// Create statement for Orders table
orders.create = 'CREATE TABLE Product(                     \
                  id                  STRING PRIMARY KEY, \
                  business_id         STRING,             \
                  name                STRING,             \
                  price               STRING              \
                  description         STRING,             \
                  FOREIGN KEY(business_id) REFERENCES business(id))';


orders.insert = 'INSERT INTO Product(id, name, price, description, business_id)' +
'VALUES(?, ?, ?, ?, ?)';



