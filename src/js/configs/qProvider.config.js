angular
  .module('multiazienda')
  .config(UnhandledRejections);

UnhandledRejections.$inject = ['$qProvider'];
function UnhandledRejections($qProvider){
  $qProvider.errorOnUnhandledRejections(false);
}
