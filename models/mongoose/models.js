'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

module.exports = function (mongoose) {
  // User Model
  var User = new Schema({
    id: ObjectId,
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    createdAt: {type: Date, default: Date.now}
  });

  var Business = new Schema({
    id: ObjectId,
    name: String,
    address: String,
    contactNumber: String,
    email: String,
    password: String,
    createdAt: {type: Date, default: Date.now}
  });

  var Product = new Schema({
    id: ObjectId,
    specifiedID: String,
    businessID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business'
    },
    price: Number,
    description: String,
    options: [{
      name: String,
      values: [{type: String}],
      priceDelta: Number
    }],
    createdAt: {type: Date, default: Date.now}
  }); 


  var mongooseModels = {
    User : mongoose.model('User', User),
    Business: mongoose.model('Business', Business),
    Product: mongoose.model('Product', Product)
  };

  return mongooseModels;
};

