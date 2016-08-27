var 
  util = require('../../libs/util'),
  chai = require('chai'), 
  expect = chai.expect;


describe('Util Test', function() {
  it('Should check if a string is valid', function() {
    expect(util.isValidString()).to.equal(false);
    expect(util.isValidString('')).to.equal(false);
    expect(util.isValidString(0)).to.equal(false);
    expect(util.isValidString('0')).to.equal(false);
    expect(util.isValidString(null)).to.equal(false);
    expect(util.isValidString(false)).to.equal(false);
    expect(util.isValidString(undefined)).to.equal(false);
    expect(util.isValidString("Valid String")).to.equal(true);
  });

  it('Should generate a random string', function() {
    // Checking if the string is a valid string is enough for this
    // test to pass.
    expect(util.isValidString(util.generateID())).to.equal(true);
  }); 
});