var 
  app = require('../../app.js'),
  request = require('supertest')(app),
  chai = require('chai'),
  testConfig  = require('../testConfig'),
  expect = chai.expect;

var token = testConfig.businessToken;
var businessID = 'S14CpSNa';

describe('POST /product.', function() {
  it ('Should add a product to the database and return http code 200', function(done) {
    var body = {
      product: {
        businessID: businessID,
        name: 'A test product',
        price: '3400',
        description: 'A test product that has succeeded.'
      }
    };
    // Make POST request.
    request
    .post('/product')
    .set('Authorization', token)
    .send(body)
    .expect(200)
    .expect(function(res) {
      expect(res.body.success).to.equal(true);
    })
    .end(function(err, res) {
      done(err);
    });
  });


  it ('Should add a product with missing value and return http code 422', function(done) {
    var body = {
      product: {
        businessID: businessID,
        name: 'A test product',
        price: '3400',
        description: ''
      }
    };
    // Make POST request.
    request
    .post('/product')
    .set('Authorization', token)
    .send(body)
    .expect(422)
    .expect(function(res) {
      expect(res.body.success).to.equal(false);
    })
    .end(function(err, res) {
      done(err);
    });
  });


  it ('Should add a product with no token and return http code 401', function(done) {
    // Make POST request.
    request
    .post('/product')
    .expect(401)
    .expect(function(res) {
      expect(res.body.success).to.equal(false);
    })
    .end(function(err, res) {
      done(err);
    });
  });
});

describe('PATCH /product.', function() {
  it ('Should attempt to update an existing product and return with HTTP code 200', function(done) {
    var body = {
      updatedProduct: {
        id: "H18cacBa", // Make sure this id exists.
        updateFields: [
          {column: "description",  newValue: "This is a new description" },
          {column: "price",  newValue: 16.00 },
        ]
      }
    };

    request
    .patch('/product')
    .set('Authorization', token)
    .send(body)
    .expect(200)
    .expect(function (res) {
      expect(res.body.success).to.equal(true);
    })
    .end(function(err, res) {
      done(err);
    });
  });
});