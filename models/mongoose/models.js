'use strict';

var mongoose = require('mongoose');


module.exports = function (mongoose) {
  // User Model
  var User = new Schema({
    id: ObjectID,
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    createdAt: {type: Date, default: Date.now}
  });

  var Business = new Schema({
    id: ObjectID,
    name: String,
    address: String,
    contactNumber: String,
    email: String,
    password: String,
    createdAt: {type: Date, default: Date.now}
  });

  var Product = new Schema({
    id: ObjectID,
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

