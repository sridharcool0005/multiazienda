angular
  .module('multiazienda')
  .controller('ClientsIndexCtrl', ClientsIndexCtrl);

ClientsIndexCtrl.$inject = ['Client', 'filterFilter', '$scope'];

function ClientsIndexCtrl(Client, filterFilter, $scope) {
  const vm = this;

  Client
    .query()
    .$promise
    .then(clients => {
      vm.clients = clients;
      filterClients();
    });

  vm.q = '';
  vm.cognome = '';
  vm.zona = '';
  vm.tipologiaAttivita = '';
  vm.searching = false;
  vm.clearSearch = clearSearch;

  function filterClients(){
    const params = {
      nome: vm.q,
      cognome: vm.cognome,
      zona: {
        name: vm.zona
      },
      tipologiaAttivita: {
        name: vm.tipologiaAttivita
      }
    };

    vm.filtered = filterFilter(vm.clients, params);
    if (vm.q === '' && vm.cognome === '' && vm.zona === '' && vm.tipologiaAttivita === '') {
      vm.searching = false;
    } else {
      vm.searching = true;
    }
  }

  $scope.$watchGroup([
    () => vm.q,
    () => vm.cognome,
    () => vm.zona,
    () => vm.tipologiaAttivita
  ], filterClients);

  function clearSearch() {
    vm.q = '';
    vm.cognome = '';
    vm.zona = '';
    vm.tipologiaAttivita = '';
  }
}
