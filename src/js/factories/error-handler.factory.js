angular
  .module('multiazienda')
  .factory('ErrorHandler', ErrorHandler);

ErrorHandler.$inject = ['$rootScope'];

function ErrorHandler($rootScope) {
  return {
    handleError: err => {
      console.log('error');
      $rootScope.$broadcast('error', err);
    }
  };
}
