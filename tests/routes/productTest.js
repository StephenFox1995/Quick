var 
  app = require('../../app.js'),
  request = require('supertest')(app),
  chai = require('chai'),
  expect = chai.expect;

var token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE0NzIyMjg0NTksImV4cCI6MTUwMzc2NDQ1OSwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoic3NAZ21haWwuY29tIiwiR2l2ZW5OYW1lIjoiU3RlcGhlbiAiLCJTdXJuYW1lIjoiRm94IiwiRW1haWwiOiJzc0BnbWFpbC5jb20ifQ.hOIoXt4KITxb5o4o7fbK8l5-lJEuf9Qs4N5seMe9Oiw';

describe('POST /product.', function() {
  it ('Should add a product to the database and return http code 200', function(done) {
    var body = {
      product: {
        businessID: 'rkxd5WL5',
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

  it ('Should add a product with invalid body and return http code 200', function(done) {
    var body = {
      product: {
        businessID: 'rkxd5WL5',
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