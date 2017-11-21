angular.module('multiazienda').controller('ClientNewCtrl', ClientNewCtrl);

ClientNewCtrl.$inject = [
  'Client',
  'Location',
  'Type',
  'Zone',
  'Place',
  '$window',
  '$http',
  '$state',
  '$rootScope'
];

function ClientNewCtrl(
  Client,
  Location,
  Type,
  Zone,
  Place,
  $window,
  $http,
  $state,
  $rootScope
) {
  const vm = this;
  vm.searchAddress = searchAddress;
  vm.chooseAddress = chooseAddress;
  vm.clientSubmit = clientNew;
  vm.clear = clear;
  vm.cancel = cancel;
  vm.showForm = showForm;
  vm.inClientNew = true;
  vm.client = {};
  fetchTypes();
  fetchZones();

  $rootScope.$on('zones added', () => {
    fetchZones();
  });

  $rootScope.$on('types added', () => {
    fetchTypes();
  });

  function searchAddress() {
    const address = document.getElementById('searchAddress').value;

    if (address.length > 0) {
      vm.errorMessage = null;
      $http
        .get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${address.replace(
            / /g,
            '+'
          )}&region=it&key=AIzaSyDuvV2-lIr6kqI6Y3LrnhItDlSERzaL_R4`
        )
        .then(response => {
          showForm('address');
          vm.results = response.data.results;
        })
        .then(() => (document.getElementById('searchAddress').value = ''));
    } else {
      vm.results = null;
      vm.errorMessage = 'Please start typing an address first';
    }
  }

  function chooseAddress(index) {
    showForm('address');
    const chosenAddress = vm.results[index];

    Place.get({ place: chosenAddress.place_id }).$promise.then(url => {
      vm.location = {
        locationId: chosenAddress.place_id,
        addressFormatted: chosenAddress.formatted_address,
        lat: chosenAddress.geometry.location.lat,
        lng: chosenAddress.geometry.location.lng,
        url: url.url,
        type: 'street address'
      };
    });
  }

  function clientNew() {
    if (vm.clientForm.$valid) {
      Location.save(vm.location)
        .$promise.then(location => {
          vm.client.indirizzo = location.id;
          vm.client.tipologiaAttivita = vm.client.tipologiaAttivita.id;
          vm.client.zona = vm.client.zona.id;
        })
        .then(() => {
          Client.save(vm.client).$promise.then(() => $state.go('clientsIndex'));
        })
        .catch(() => {
          $rootScope.$broadcast('displayMessage', {
            type: 'danger',
            content: "Attenzione: l'indirizzo e gia esistente, cercane un altro"
          });
        });
    }
  }

  function clear(input) {
    vm.client[input] = '';
  }

  function cancel() {
    vm.results = null;
    if (vm.location) {
      return (vm.location = null);
    }
    showForm('address');
  }

  function showForm(which) {
    $rootScope.$broadcast('showing modal', {
      which: which
    });
  }

  function fetchZones() {
    Zone.query().$promise.then(zones => (vm.zones = zones));
  }

  function fetchTypes() {
    Type.query().$promise.then(types => (vm.types = types));
  }
}
