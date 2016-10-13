var 
  app     = require('../../app.js'),
  request = require('supertest')(app),
  chai    = require('chai'),
  expect  = chai.expect;


/**
 * Global token.
 */
var globalToken = '';
/**
 * Global business object that was sucessfully created.
 */
var globalBusiness = {};

/**
 * Generate HTTP Authorization Header field.
 * @param {string} token - The token.
 * @return {string} Authorization header string.
 */
function genAuthHeaderString(token) {
  return 'Bearer ' + token;
}

describe('POST /product.', function() {
  it ('Should add a product to the database and return http code 200', function(done) {
    // As a business is needed to add a product to the database.
    // The business will be created first.
    var email = Math.random().toString(36).substr(2, 5) + '@test.com';
    // Mock business.
    var body = {
      business : {
        name: 'Great New Business',
        address: '33 Space Drive',
        contactNumber: '50-50-203-892',
        email: email,
        password: 'strong-password'
      }
    };

    // Make POST request.
    request
    .post('/business')
    .send(body)
    .expect(200)
    .expect(function(res) {
      expect(res.body.success).to.equal(true);
      // Make sure to set the global token object
      // and business object. This business object will be used for future mocking.
      globalToken = res.body.token;
      globalBusiness = token.verifySync(globalToken);
    })
    .end(function(err, res) {
      // Now add products for this business.
      var body = {
        product: {
          name: 'A test product',
          price: 3400,
          description: 'Test Product Description'
        }
      };

      // Make POST request.
      request
      .post('/product')
      .set('Authorization', genAuthHeaderString(globalToken))
      .send(body)
      .expect(200)
      .expect(function(res) {
        expect(res.body.success).to.equal(true);
      })
      .end(function(err, res) {
        done(err);
      });
    });
  });  



  it ('Should add a product with invalid value and return http code 422', function(done) {
    var body = {
      product: {
        businessID: globalBusiness.id,
        name: '',
        price: '3400',
        description: ''
      }
    };
    // Make POST request.
    request
    .post('/product')
    .set('Authorization', genAuthHeaderString(globalToken))
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

// describe('PATCH /product.', function() {
//   it ('Should attempt to update an existing product and return with HTTP code 200', function(done) {
//     var body = {
//       updatedProduct: {
//         id: "H18cacBa", // Make sure this id exists.
//         updateFields: [
//           {column: "description",  newValue: "This is a new description" },
//           {column: "price",  newValue: 16.00 },
//         ]
//       }
//     };

//     request
//     .patch('/product')
//     .set('Authorization', token)
//     .send(body)
//     .expect(200)
//     .expect(function (res) {
//       expect(res.body.success).to.equal(true);
//     })
//     .end(function(err, res) {
//       done(err);
//     });
//   });
// });