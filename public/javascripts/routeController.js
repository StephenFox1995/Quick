var app = angular.module('routeController', []);

// Use this service to know where to go next, e.g after login etc.
app.factory('whereTo', ['LOGIN',
                        'ACCOUNT_CREATION_SUCCESS',
                        'ACCOUNT_CREATION_FAILED',
                        'ROUTES',
  function (LOGIN,
            ACCOUNT_CREATION_SUCCESS,
            ACCOUNT_CREATION_FAILED,
            ROUTES) {
    return {
      nextRoute : function (action) {
        switch (action) {
          case LOGIN.value:
            document.location.href = ROUTES.home;
            // Change current route to user logged in.
            break;
          case ACCOUNT_CREATION_SUCCESS.value:
            // Change current route to creation success.
            break;
          case ACCOUNT_CREATION_FAILED.value:
            // Change current router to creation failed.
            break;
        }
      }
    }
  }
]);

app.constant('ROUTES', {
  home: '/views/home'
});

app.constant('LOGIN', 'LoginRoute');
app.constant('ACCOUNT_CREATION_SUCCESS', 'AccountCreationSuccessRoute');
app.constant('ACCOUNT_CREATION_FAILED', 'AccountCreationFailedRoute');