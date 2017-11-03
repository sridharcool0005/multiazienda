angular
  .module('multiazienda')
  .controller('BarNewCtrl', BarNewCtrl);

BarNewCtrl.$inject = ['Type','Zone', 'Location', 'Bar', '$state', '$rootScope', '$scope'];

function BarNewCtrl(Type, Zone, Location, Bar, $state, $rootScope, $scope) {
  const vm = this;

  vm.pushId = pushId;
  vm.changePhoto = changePhoto;
  let startCounter = 0;
  vm.barNew = barNew;
  vm.clear = clear;
  vm.showTypeForm = showTypeForm;
  vm.showZoneForm = showZoneForm;
  vm.typeNew = typeNew;
  vm.zoneNew = zoneNew;

  Type
    .query()
    .$promise
    .then(types => vm.types = types);

  Zone
    .query()
    .$promise
    .then(zones => vm.zones = zones);

  $rootScope.$on('new place', function(event, args) {
    vm.photoArray = args.photoArray;

    vm.location = {
      locationId: args.locationId,
      addressHTML: args.addressHTML,
      addressFormatted: args.addressFormatted,
      lat: args.lat,
      lng: args.lng
    };

    vm.bar = {
      denominazioneAttivita: args.name,
      fotoAttivita: args.photoArray[0],
      locationId: args.locationId,
      website: args.website
    };

    $scope.$apply();
  });

  function pushId(type) {
    const parseId = vm.bar[type];
    vm.bar[type] = parseId;
  }

  function clear(input) {
    vm.bar[input] = '';
  }

  function changePhoto() {
    if (startCounter < (vm.photoArray.length - 1)) {
      vm.bar.fotoAttivita = vm.photoArray[startCounter + 1];
      startCounter += 1;
    } else {
      vm.bar.fotoAttivita = vm.photoArray[0];
      startCounter = 1;
    }
  }

  function barNew() {
    Location
      .save(vm.location)
      .$promise
      .then(location => {
        vm.bar.indirizzo = location.id;
      })
      .then(() => {
        Bar
          .save(vm.bar)
          .$promise
          .then(() => {
            $state.go('barsIndex');
          });
      });
  }

  function showTypeForm() {
    (vm.formTypeShown) ? vm.formTypeShown = false : vm.formTypeShown = true;
  }
  function showZoneForm() {
    (vm.formZoneShown) ? vm.formZoneShown = false : vm.formZoneShown = true;
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
            vm.formTypeShown = false;
          });
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
            vm.formZoneShown = false;
          });
      });
  }
}
