angular
  .module('multiazienda')
  .controller('ClientEditCtrl', ClientEditCtrl);

ClientEditCtrl.$inject = ['Client', 'Type', 'Zone', '$window', '$stateParams', '$http', '$state'];

function ClientEditCtrl(Client, Type, Zone, $window, $stateParams, $http, $state) {
  const vm = this;

  vm.searchAddress = searchAddress;
  vm.chooseAddress = chooseAddress;
  vm.clientEdit = clientEdit;

  Client
    .get({ id: $stateParams.id })
    .$promise
    .then(client => vm.client = client);

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
    const address = vm.searchInput.value;

    $http
      .get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address.replace(/ /g,'+')}&region=it&key=AIzaSyDuvV2-lIr6kqI6Y3LrnhItDlSERzaL_R4`)
      .then(response => vm.results = response.data.results)
      .then(() => document.getElementById('searchAddress').value = '');
  }

  function chooseAddress(index) {
    const chosenAddress = vm.results[index];
    vm.location = {
      locationId: chosenAddress.place_id,
      addressFormatted: chosenAddress.formatted_address,
      lat: chosenAddress.geometry.location.lat,
      lng: chosenAddress.geometry.location.lng,
      type: 'street address'
    };

    vm.results = null;
  }

  function clientEdit() {
    Client
      .update({ id: $stateParams.id }, vm.client)
      .$promise
      .then(() => {
        $state.go('clientsIndex');
      });
  }
}
