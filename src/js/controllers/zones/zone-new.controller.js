angular
  .module('multiazienda')
  .controller('ZoneNewCtrl', ZoneNewCtrl);

ZoneNewCtrl.$inject = ['Zone', '$rootScope'];

function ZoneNewCtrl(Zone, $rootScope) {
  const vm = this;

  vm.showZoneForm = showZoneForm;
  vm.zoneNew = zoneNew;

  function showZoneForm() {
    $rootScope.$broadcast('showing modal', {
      which: 'zone'
    });
  }

  function zoneNew() {
    Zone
      .save(vm.zone)
      .$promise
      .then(() => {
        Zone
          .query()
          .$promise
          .then(zones => {
            vm.zone = {};
            vm.zones = zones;
            $rootScope.$broadcast('zones added');
            $rootScope.$broadcast('showing modal', {
              which: 'zone'
            });
          });
      });
  }
}
