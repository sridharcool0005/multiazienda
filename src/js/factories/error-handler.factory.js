angular
  .module('multiazienda')
  .factory('ErrorHandler', ErrorHandler);

ErrorHandler.$inject = ['$rootScope'];

function ErrorHandler($rootScope) {
  return {
    handleError: err => {
      $rootScope.$broadcast('error', err);
    }
  };
}
