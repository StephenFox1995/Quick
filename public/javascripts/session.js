(function () {

  angular
    .module('session', [
      'angular-jwt'
    ])
    .factory('sessionService', sessionService)
    .factory('sessionInterceptor', sessionInterceptor)
    .config(httpAuthHeaderConfig);


  httpAuthHeaderConfig.inject = ['$httpProvider'];
  function httpAuthHeaderConfig($httpProvider) {
    $httpProvider.interceptors.push('sessionInterceptor');
  }

  sessionService.inject = ['jwtHelper'];
  function sessionService(jwtHelper) {
    return {
      setToken : setToken,
      getToken: getToken,
      getClientID: getClientID,
      getClientName: getClientName
    };
    /**
     * Retrieves the token from localStorage.
     * @return {String} The token.
     */
    function getToken() {
      return localStorage.getItem('token');
    }
    /**
     * Sets the token for this session in localStorage.
     * @param {String} token - The token to set.
     */
    function setToken(token) {
      localStorage.setItem('token', token);
    }
    /**
     * Retrieves the id of the client who owns the current session.
     * @return {String} id - The id of the client.
     */
    function getClientID() {
      var token = localStorage.getItem('token');
      var tokenPayload = jwtHelper.decodeToken(token);
      return tokenPayload.id;
    }
    /**
     * Retrieves the name of the client who owns the current session.
     * @return {String} id - The name of the client.
     */
    function getClientName() {
      var token = localStorage.getItem('token');
      var tokenPayload = jwtHelper.decodeToken(token);
      return tokenPayload.name;
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