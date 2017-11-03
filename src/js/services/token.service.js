angular
  .module('multiazienda')
  .service('TokenService', TokenService);

TokenService.$inject = ['$window', 'jwtHelper'];

function TokenService($window, jwtHelper) {
  const self = this;

  self.setToken = (token) => {
    return $window.localStorage.setItem('auth-token', token);
  };

  self.getToken = function getToken() { // (a)
    return $window.localStorage.getItem('auth-token');
  };

  self.decodeToken = () => { // (b)
    const token = self.getToken(); // (c)

    return token ? jwtHelper.decodeToken(token) : null; // (d)
  };

  self.removeToken = () => { // <-- HERE
    $window.localStorage.clear();
  };
}
