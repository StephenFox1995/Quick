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

product.updateExistingProduct = 'UPDATE Product SET ' +
  '(specifiedID, name, price, description, options)' +
  ' = (?, ?, ?, ?, ?) WHERE id = ?';

/**
 * Generates an update statement for the product table.
 * @param {string} productID - The id of the product.
 * @param {array} updateFields - The fields to updated.
 * 
 * For example the following updateFields array:
 *    [ {column: "description",  newValue: "This is a new description" },
 *      {column: "price",  newValue: 13.00} ]
 * 
 * will result in the following query string:
 *  UPDATE Product SET description= ?, price= ? WHERE id = ?;;
 * 
 * @return {string} - String to update Product table.
 */
product.generateUpdateQueryString = function(productID, updateFields) {
  var updateString = 'UPDATE Product SET ';

  updateFields.forEach(function(field, index) {
    var fieldName = field.column;
    updateString += fieldName;
    
    if (index != updateFields.length - 1) {
      updateString += '= ?, ';
    } else {
      updateString += '= ? ';
    }
  });


  updateString += 'WHERE id = ?;';
  return updateString;

};