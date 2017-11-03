angular
  .module('multiazienda')
  .controller('SeenBarNewCtrl', SeenBarNewCtrl);

SeenBarNewCtrl.$inject = ['SeenBar', 'Client', 'Bar', 'filterFilter', '$scope', '$http', 'API', '$state', '$stateParams'];

function SeenBarNewCtrl(SeenBar, Client, Bar, filterFilter, $scope, $http, API, $state, $stateParams) {
  const vm = this;

  vm.seenBar = {};
  vm.addSeenBar = addSeenBar;
  vm.saveSeenBar = saveSeenBar;

  Bar // only query the bars which haven't been added to the client yet
    .query()
    .$promise
    .then(bars => {
      vm.bars = [];

      Client
        .get({ id: $stateParams.id })
        .$promise
        .then(client => {
          vm.client = client;
          if (client.attivitaViste.length === 0) {
            vm.bars = bars;
          } else {
            for (var j = 0; j < client.attivitaViste.length; j++) {
              for (var i = 0; i < bars.length; i++) {
                if (`${client.attivitaViste[j].bar.id}` !== `${bars[i].id}`) vm.bars.push(bars[i]);
              }
            }
          }
        });
    });

  function filterBars(){
    const params = { denominazioneAttivita: vm.q};
    if (vm.q === '') {
      vm.filtered = [];
    } else {
      vm.filtered = filterFilter(vm.bars, params);
    }
  }

  $scope.$watch(() => vm.q, filterBars);

  function addSeenBar(bar) {
    vm.seenBar.bar = bar;
    vm.q = '';
    vm.filtered = '';
  }

  function saveSeenBar() {
    vm.seenBar.bar = vm.seenBar.bar.id;
    vm.seenBar.data = new Date(vm.seenBar.data);
    $http({
      method: 'POST',
      url: `${API}/clients/${$stateParams.id}/bars`,
      data: vm.seenBar
    })
      .then(() => $state.go('clientShow', { id: $stateParams.id }));
  }
}
