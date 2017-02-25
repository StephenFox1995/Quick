const fs = require('fs');
const csv = require('csv-parser')

function Prediction() {}

Prediction.prototype.getOrderPrediction = function getOrderPrediction(id, cb) {
  const orderAmountFile = 'orderAmountRun_results.csv';
  const filein = `/Users/stephenfox/Desktop/prediction/${id}/${orderAmountFile}`;
  const predictionData = [];
  fs.createReadStream(filein)
    .pipe(csv())
    .on('data', (data) => {
      predictionData.push({ 
        timestamp: data.timestamp,
        orders: data.orders,
        prediction: data.prediction,
      });
    })
    .on('end', () => cb(null, predictionData));
};

module.exports = Prediction;