const fs = require('fs');
const csv = require('csv-parser')
const mongoose = require('mongoose');
const models = require('../models/mongoose/models')(mongoose);


function Prediction() { }
Prediction.prototype.Schema = models.Prediction;

Prediction.prototype.getOrderPrediction = function getOrderPrediction(id, cb) {
  this.Schema.findOne({ "businessID": new mongoose.Types.ObjectId(id) }, cb);
};

Prediction.prototype.getOrderPredictionNextHour = function (id, cb) {
  this.Schema.aggregate([
    { $unwind: "$data" },
    { $match: {
        $and: [
          { businessID: new mongoose.Types.ObjectId(id) },
          { "data.timestamp": { $eq: dateObjectForLastHour() } }]
      }
    }
  ], cb);
};

// Creates a date object for the last hour.
function dateObjectForLastHour() {
  var date = new Date(Date.now() - 1 * 60 * 60 * 1000);
  return dateObjectForComparison(date);
}

// Modifies the date object so it is comparable
// timestamp in database.
function dateObjectForComparison(date) {
  // zero out minutes, sec, milliseconds
  date.setMinutes(0, 0, 0);
  return date;
}

module.exports = Prediction;