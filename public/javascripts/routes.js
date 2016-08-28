
(function () {
  'use strict';
  angular.module('routes', [])
    .factory('whereTo', whereTo)
    .constant('ROUTES', {
      home: '/views/home',
      businessHome: '/views/businessHome'
    });

  whereTo.inject = ['ROUTES'];
  function whereTo(ROUTES) {
    return {
      nextRoute: nextRoute
    };

    function nextRoute(route) {
      switch (route) {
        case ROUTES.home:
          document.location.href = ROUTES.home;
          break;
        case ROUTES.businessHome:
          document.location.href = ROUTES.businessHome;
          break;
        default:
          console.log('Invalid route.');
          break;
      }
    };
  }
})();