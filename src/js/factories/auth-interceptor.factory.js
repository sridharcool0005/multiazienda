angular
  .module('multiazienda')
  .factory('AuthInterceptor', AuthInterceptor);

AuthInterceptor.$inject = ['API', 'TokenService'];

function AuthInterceptor(API, TokenService) {
  return {
    request: function(req) {
      const token = TokenService.getToken(); // (a)
      if (req.url.indexOf(API) === 0 && token) { //(a)
        req.headers.Authorization = `Bearer ${token}`; //(b)
      }
      return req;
    },
    response: function(res) {
      if (res.config.url.indexOf(API) === 0 && res.data.token) { // (a)
        TokenService.setToken(res.data.token); // (b)
      }
      return res;
    }
  };
}
