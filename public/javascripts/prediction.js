angular
  .module('prediction', [])
  .factory('predictionService', predictionService);

predictionServer.inject = ['$http'];
function predictionServer($http) {
  /**
   * Gets the prediction data for a business.
   */
  function predictionDataForBusiness(businessID) {
    return new Promise((resolve, reject) => {
      const url = `/prediction/${businessID}`;
      $http.get(url).then(resolve, reject);
    });
  }
  return { predictionDataForBusiness };
}

