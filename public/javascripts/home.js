(function () {
  'use strict';

  angular
    .module('home', [
      'session',
      'purchase'
    ])
    .controller('HomeController', HomeController)
    .factory('setupHomeViews', setupHomeViews);


  HomeController.inject = ['$scope', 'setupHomeViews'];
  function HomeController($scope, setupHomeViews) {
    $scope.purchases = null;

    setupHomeViews.purchasesView(function (err, data) {
      if (err) {
        // TODO: Display error.
      }
      $scope.purchases = data.purchases;
    });
  }



  setupHomeViews.inject = ['purchaseService'];
  function setupHomeViews(purchaseService) {
    return {
      purchasesView: setupRecentPurchases
    };
    
    function setupRecentPurchases(callback) {
      purchaseService.getUserPurchases(function (data) {
        validateResponse(data) ? callback(null, data): callback(new Error, data);
      });
    }
    function validateResponse(data) {
      return data.success;
    }
  }
}());
