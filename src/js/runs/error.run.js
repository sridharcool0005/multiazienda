angular
  .module('multiazienda')
  .run(stateChangeError);

stateChangeError.$inject = [
  '$state',
  '$rootScope'
];
function stateChangeError(
  $state,
  $rootScope
){
  /*
   * When a transition fails due to a user being logged out and the query in
   * ui-router not working, the `$stateChangeError` will be caught and the
   * user will be redirected to the error page.
   *
   * We've used $qProvider in the config to turn off UnhandledRejections
   */
  $rootScope.$on('$stateChangeError', (event, toState, toParams, fromState, fromParams, error) => {
    event.preventDefault();
    if (error === 'Not Authorized') {
      return $state.go('login');
    } else {
      return $state.go('error');
    }
  });
}
