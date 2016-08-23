(function () {

  angular
    .module('session', [])
    .factory('sessionService', sessionService)
    .factory('sessionInterceptor', sessionInterceptor)
    .config(httpAuthHeaderConfig);


  httpAuthHeaderConfig.inject = ['$httpProvider'];
  function httpAuthHeaderConfig($httpProvider) {
    $httpProvider.interceptors.push('sessionInterceptor');
  }

  
  function sessionService() {
    return {
      setToken : setToken,
      getToken: getToken
    };
    function getToken() {
      return localStorage.getItem('token');
    }
    function setToken(token) {
      localStorage.setItem('token', token);
    }
  }


  sessionInterceptor.inject = ['sessionService'];
  function sessionInterceptor(sessionService) {
    return {
      request: request
    };
    function request(config) {
      config.headers = config.headers || {};
      var bearer = 'Bearer ' + sessionService.getToken();
      config.headers.Authorization = bearer;
      return config;
    }
  }

}());