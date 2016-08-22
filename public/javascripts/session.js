(function () {

  angular
    .module('session', [])
    .config(httpHeaderConfig);

  function sessionProvider() {
    this.getToken = function () {
      return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC" +
        "J9.eyJlbWFpbCI6InNzQGdtYWlsLmNvbSIsImlkIjoiSD" +
        "FFckFoVmMiLCJmaXJzdG5hbWUiOiJTdGVwaGVu" +
        "IiwibGFzdG5hbWUiOiJGb3giLCJpYXQiOjE0Nz" +
        "E4MDgzMDgsImV4cCI6MTQ3MTg0NDMwOH0.cy9d" +
        "wW8hQ9P-gEAy5Ae2auAlnGZ5IsQ_fgEBqFbd99I";
    };

    this.$get = function() {
      var token = this.getToken;
      return {
        token: token
      }
    };
  }

  httpHeaderConfig.inject = ['$httpProvider'];
  function httpHeaderConfig($httpProvider) {
    $httpProvider.defaults.headers.common = {
      'Authorization': 'Bearer ' + sessionProvider.token
    };
  }
}());