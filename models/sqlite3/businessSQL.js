'use strict';

var business = exports;

// Create statement for Business table
business.create =
'create table Business( ' +
  'id             STRING primary key,' +
  'name           String,' +
  'address        String,' +
  'contactNumber  String,' +
  'email          String,' +
  'password       String,' +
  'Unique(email)' +
');';

// Insert statement for Business table.
business.insert = 'INSERT INTO Business(id, name, address, contactNumber, email, password) ' +
  'VALUES(?, ?, ?, ?, ?, ?);';

business.all = 'SELECT id, name, address, contactNumber, email FROM Business;';

business.info = 'SELECT id, name, address, contactNumber, email  FROM Business WHERE id = ?';

business.getBusiness = 'SELECT id, password, name, address, contactNumber, email, password FROM Business WHERE email' +
  ' = ?;';

business.getPurchases = 
  'SELECT ' +
  'Purchase.id          as purchaseID, ' +
  'Product.id           as productID, ' +
  'Product.name         as productName, ' +
  'Product.price        as productPrice, ' +
  'Product.description  as productDescription ' +
  'FROM Purchase ' +
  'JOIN Product ON Product.id = Purchase.productID ' +
  'WHERE Purchase.businessID = ?';