angular
  .module('multiazienda')
  .service('CurrentUserService', CurrentUserService);

CurrentUserService.$inject = ['TokenService', 'User', '$rootScope']; // (a)

function CurrentUserService(TokenService, User, $rootScope) {
  // (a)
  const self = this;

  // self.getUser = async() => {
  //   const decoded = TokenService.decodeToken();
  //   if (decoded) {
  //     self.currentUser = await User
  //       .get({ id: decoded.id })
  //       .$promise
  //       .catch(() => {
  //         $rootScope.$broadcast('displayMessage', {
  //           type: 'danger',
  //           content: 'Unauthorized!!!'
  //         });
  //       });
  //
  //     if (self.currentUser) return true;
  //     return false;
  //   }
  // };

  self.getUser = () => {
    const decoded = TokenService.decodeToken();
    if (decoded) {
      User.get({ id: decoded.userId }).$promise.then(data => {
        self.currentUser = data;
        $rootScope.$broadcast('loggedIn');
      });
    }
  };

  self.removeUser = () => {
    self.currentUser = null;
    TokenService.removeToken();
    $rootScope.$broadcast('loggedOut');
  };

  self.getUser();
}
