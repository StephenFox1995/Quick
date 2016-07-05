'use strict';

var purchase = exports;

// Create statement for purchases.
purchase.create = 'CREATE TABLE Purchase(     \
                    id STRING   PRIMARY KEY,  \
                    product_id   STRING       \
                    business_id  STRING,      \
                    user_id      STRING,      \
                    FOREIGN KEY(product_id)  REFERENCES Product(id), \
                    FOREIGN KEY(business_id) REFERENCES Business(id), \
                    FOREIGN KEY(user_id)     REFERENCES User(id))';

purchase.insert = 'INSERT INTO Purchase(id, product_id, business_id, user_id) VALUES(?, ?, ?, ?)';