angular
  .module('multiazienda')
  .config(Interceptor);

Interceptor.$inject = ['$httpProvider'];

function Interceptor($httpProvider) {
  return $httpProvider.interceptors.push('AuthInterceptor', 'ErrorHandler');
}
