angular
  .module('multiazienda')
  .controller('TypeNewCtrl', TypeNewCtrl);

TypeNewCtrl.$inject = ['Type', '$rootScope'];

function TypeNewCtrl(Type, $rootScope) {
  const vm = this;

  vm.showTypeForm = showTypeForm;
  // vm.formTypeShown = false;
  vm.typeNew = typeNew;

  function showTypeForm() {
    $rootScope.$broadcast('showing modal', {
      which: 'type'
    });
  }

  function typeNew() {
    Type
      .save(vm.type)
      .$promise
      .then(() => {
        Type
          .query()
          .$promise
          .then(types => {
            vm.type = {};
            vm.types = types;
            $rootScope.$broadcast('types added');
            $rootScope.$broadcast('showing modal', {
              which: 'type'
            });
          });
      });
  }
}
