angular
  .module('multiazienda')
  .controller('BarEditCtrl', BarEditCtrl);

BarEditCtrl.$inject = ['Bar', 'Type', 'Zone', '$stateParams', '$state'];

function BarEditCtrl(Bar, Type, Zone, $stateParams, $state) {
  const vm = this;

  vm.barEdit = barEdit;

  Type
    .query()
    .$promise
    .then(types => {
      vm.types = types;
    });

  Zone
    .query()
    .$promise
    .then(zones => {
      vm.zones = zones;
    });

  Bar
    .get({ id: $stateParams.id })
    .$promise
    .then(bar => {
      vm.bar = bar;
    });

  function barEdit() {
    Bar
      .update({ id: $stateParams.id }, vm.bar)
      .$promise
      .then(() => {
        $state.go('barsIndex');
      });
  }
}
