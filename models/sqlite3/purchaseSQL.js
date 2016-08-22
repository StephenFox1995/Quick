'use strict';

var purchase = exports;

// Create statement for purchases.
purchase.create = 'CREATE TABLE Purchase(' +
  'id         STRING PRIMARY KEY,' +
  'productID  STRING,' +
  'businessID STRING,' +
  'userID     STRING,' +
  'FOREIGN KEY(productID) REFERENCES Product(id),' +
  'FOREIGN KEY(businessID) REFERENCES Business(id),' +
  'FOREIGN KEY(userID) REFERENCES User(id));';

purchase.insert = 'INSERT INTO Purchase(id, productID, businessID, userID) VALUES(?, ?, ?, ?)';

purchase.userPurchases =
  'SELECT ' +
  'Purchase.id          as purchaseID, ' +
  'Product.id           as productID, ' +
  'Product.name         as productName, ' +
  'Product.price        as productPrice, ' +
  'Product.description  as productDescription, ' +
  'Business.name        as businessName, ' +
  'Business.address     as businessAddress, ' +
  'Business.email       as businessEmail ' +
  'FROM Purchase ' +
  'JOIN Product ON Product.id = Purchase.productID ' +
  'JOIN Business ON Business.id = Purchase.businessID ' +
  'WHERE Purchase.userID = ?';