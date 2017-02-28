var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

module.exports.initialized = false;
module.exports = function (mongoose) {
  if (!module.exports.initialized) {
    module.exports.initialized = true;

    // User Model
    var User = new Schema({
      id: ObjectId,
      firstname: String,
      lastname: String,
      email: String,
      password: String,
      createdAt: { type: Date, default: Date.now },
    });

    var Business = new Schema({
      id: ObjectId,
      name: String,
      address: String,
      contactNumber: String,
      email: String,
      password: String,
      createdAt: { type: Date, default: Date.now },
      coordinates: {
        lat: Number,
        lng: Number,
      },
      period: {
        begin: Number,
        end: Number,
      },
    });

    var Product = new Schema({
      id: ObjectId,
      name: String,
      specifiedID: String,
      businessID: {
        type: ObjectId,
        ref: 'Business',
      },
      price: Number,
      description: String,
      options: [{
        name: String,
        values: [{ name: String, priceDelta: Number }],
      }],
      createdAt: { type: Date, default: Date.now },
      processing: Number,
    });

    var Order = new Schema({
      id: ObjectId,
      products: [],
      processing: Number,
      cost: Number,
      businessID: {
        type: ObjectId,
        ref: 'Business',
      },
      userID: {
        type: ObjectId,
        ref: 'User',
      },
      coordinates: {
        lat: Number,
        lng: Number,
      },
      createdAt: { type: Date, default: Date.now },
      status: String,
      travelMode: String,
      release: Date,
      deadline: Date,
      finish: Date,
    });
    var Prediction = new Schema({});
  }
  return {
    User: mongoose.model('User', User),
    Business: mongoose.model('Business', Business),
    Product: mongoose.model('Product', Product),
    Order: mongoose.model('Order', Order),
    Prediction: mongoose.model('Prediction', Prediction)
  };
};
