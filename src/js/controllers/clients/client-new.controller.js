angular
  .module('multiazienda')
  .controller('ClientNewCtrl', ClientNewCtrl);

ClientNewCtrl.$inject = ['Client', 'Location', 'Type', 'Zone', '$window', '$http', '$state', '$rootScope'];

function ClientNewCtrl(Client, Location, Type, Zone, $window, $http, $state, $rootScope) {
  const vm = this;
  vm.searchAddress = searchAddress;
  vm.chooseAddress = chooseAddress;
  vm.clientNew = clientNew;
  vm.clear = clear;
  vm.cancel = cancel;
  vm.showTypeForm = showTypeForm;
  vm.showZoneForm = showZoneForm;
  vm.typeNew = typeNew;
  vm.zoneNew = zoneNew;
  vm.client = {};
  Zone
    .query()
    .$promise
    .then(zones => vm.zones = zones);

  Type
    .query()
    .$promise
    .then(types => vm.types = types);

  $window.addEventListener('load', () => {
    vm.searchBtn = document.getElementById('searchBtn');

    vm.searchInput = document.getElementById('searchAddress');
  });

  function searchAddress() {
    sendMessage();
    const address = document.getElementById('searchAddress').value;

    if (address.length > 0) {
      $http
        .get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address.replace(/ /g,'+')}&region=it&key=AIzaSyDuvV2-lIr6kqI6Y3LrnhItDlSERzaL_R4`)
        .then(response => vm.results = response.data.results)
        .then(() => document.getElementById('searchAddress').value = '');
    } else {
      vm.results = [];
    }
  }

  function chooseAddress(index) {
    sendMessage();
    const chosenAddress = vm.results[index];
    vm.location = {
      locationId: chosenAddress.place_id,
      addressFormatted: chosenAddress.formatted_address,
      lat: chosenAddress.geometry.location.lat,
      lng: chosenAddress.geometry.location.lng,
      type: 'street address'
    };
  }

  function clientNew() {
    Location
      .save(vm.location)
      .$promise
      .then(location => {
        vm.client.indirizzo = location.id;
        vm.client.tipologiaAttivita = vm.client.tipologiaAttivita.id;
        vm.client.zona = vm.client.zona.id;
        vm.client.archiviato = false;
      })
      .then(() => {
        Client
          .save(vm.client)
          .$promise
          .then(() => $state.go('clientsIndex'));
      });
  }

  function clear(input) {
    vm.client[input] = '';
  }

  function cancel() {
    vm.results = null;
    if (vm.location) {
      return vm.location = null;
    }
    sendMessage();
  }

  function showTypeForm() {
    if (vm.formTypeShown) {
      vm.formTypeShown = false;
    } else {
      vm.formTypeShown = true;
    }
    sendMessage();
  }
  function showZoneForm() {
    if (vm.formZoneShown) {
      vm.formZoneShown = false;
    } else {
      vm.formZoneShown = true;
    }
    sendMessage();
  }

  function sendMessage() {
    $rootScope.$broadcast('showing modal');
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
