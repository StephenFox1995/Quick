angular
  .module('prediction', [
    'session',
    'ngVis',
  ])
  .factory('predictionService', predictionService);

predictionService.inject = ['$http', 'sessionService'];
function predictionService($http, sessionService) {
  return { orderPredictionDataForBusiness, transformPredictionData };
  /**
   * Gets the prediction data for a business.
   */
  function orderPredictionDataForBusiness() {
    return new Promise((resolve, reject) => {
      const url = `/prediction/order/business/${sessionService.getClientID()}`;
      $http.get(url).then(resolve, reject);
    });
  }

  /**
   * Transforms prediction to graph representation.
   */
  function transformPredictionData(data) {
    return data.map((record) => { 
      return { x: record.timestamp, y: parseFloat(record.prediction) } 
    });
  }
}

