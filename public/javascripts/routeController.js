var app = angular.module('routeController', []);

// Use this service to know where to go next, e.g after login etc.
app.factory('whereTo', ['LOGIN',
                        'ACCOUNT_CREATION_SUCCESS',
                        'ACCOUNT_CREATION_FAILED',
  function (LOGIN,
            ACCOUNT_CREATION_SUCCESS,
            ACCOUNT_CREATION_FAILED) {
    return {
      nextRoute : function (action) {
        switch (action) {
          case LOGIN.value:
            console.log('I got it :)');
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

app.constant('LOGIN', 'LoginRoute');
app.constant('ACCOUNT_CREATION_SUCCESS', 'AccountCreationSuccessRoute');
app.constant('ACCOUNT_CREATION_FAILED', 'AccountCreationFailedRoute');
