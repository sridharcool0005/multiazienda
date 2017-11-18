angular.module('multiazienda').factory('ErrorHandler', ErrorHandler);

ErrorHandler.$inject = ['$rootScope'];

function ErrorHandler($rootScope) {
  console.log('hit');
  return {
    handleError: err => {
      console.log(err);
      $rootScope.$broadcast('error', err);
    }
  };
}
