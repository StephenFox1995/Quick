(function () {
  'use strict';

  angular
    .module('home', [
      'session',
      'purchase'
    ])
    .controller('HomeController', HomeController);


  HomeController.inject = ['$scope', 'purchaseService'];
  function HomeController($scope, purchaseService) {
    purchaseService.getUserPurchases(function (data) {
      console.log(data);
    });

  }
}());
