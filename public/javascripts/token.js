(() => {
  angular
    .module('token', ['angular-jwt'])
    .factory('tokenService', tokenService);

  tokenService.inject = ['jwtHelper'];
  function tokenService(jwtHelper) {
    return {
      decode,
      expired,
    };

    function decode(token) {
      return jwtHelper.decodeToken(token);
    }

    function expired(token) {
      return jwtHelper.isTokenExpired(token);
    }
  }
})();
