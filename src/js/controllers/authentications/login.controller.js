angular.module('multiazienda').controller('LoginCtrl', LoginCtrl);

LoginCtrl.$inject = ['User', 'CurrentUserService', '$state', '$rootScope'];
function LoginCtrl(User, CurrentUserService, $state, $rootScope) {
  const vm = this;

  vm.login = login;

  function login() {
    User.login(vm.user)
      .$promise.then(() => {
        CurrentUserService.getUser();
        $state.go('home');
      })
      .catch(() => {
        $rootScope.$broadcast('displayMessage', {
          type: 'danger',
          content: 'Attenzione: le credenziali non sono corrette'
        });
      });
  }
}
