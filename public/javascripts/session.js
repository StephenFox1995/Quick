(function () {

  angular
    .module('session', [])
    .provider('session', session)
    .config(httpConfig);

  function session() {
    this.getToken = function () {
      return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNzQG" +
        "dtYWlsLmNvbSIsImlkIjoiSDFFckFoVmMiLCJmaXJzdG5" +
        "hbWUiOiJTdGVwaGVuIiwibGFzdG5hbWUiOiJGb3giLCJpYXQ" +
        "iOjE0NzE4OTY5MDgsImV4cCI6MTQ3MTkzMjkwOH0.0nY9lcuwA_-bM" +
        "i6V2UHa6vBfwyNQBH067jp3VKQ9GEM"
    };

    this.$get = function() {
      var token = this.getToken;
      return {
        token: token
      }
    };
  }


  httpConfig.inject = ['$httpProvider', 'sessionProvider'];
  function httpConfig($httpProvider, sessionProvider) {
    $httpProvider.defaults.headers.common = {
      'Authorization': 'Bearer ' + sessionProvider.getToken()
    };
  }
}());