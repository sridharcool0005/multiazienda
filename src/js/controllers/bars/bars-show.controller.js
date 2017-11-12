angular
  .module('multiazienda')
  .controller('BarShowCtrl', BarShowCtrl);

BarShowCtrl.$inject = ['Bar', 'Client', '$stateParams', '$window', 'CurrentUserService', '$state', '$timeout'];

function BarShowCtrl(Bar, Client, $stateParams, $window, CurrentUserService, $state, $timeout) {
  const vm = this;

  vm.potentialClients = [];
  vm.addComment = comment;
  vm.deleteComment = deleteComm;
  vm.archive = archive;
  vm.expandDetails = expandDetails;

  $timeout(() => {
    const mapDivHeight = 300 - document.getElementById('indirizzo').offsetHeight;
    document.getElementsByClassName('details-map')[0].style.height = `${mapDivHeight}px`;
  }, 50);

  Bar
    .get({ id: $stateParams.id })
    .$promise
    .then(bar => {
      vm.bar = bar;
      vm.center = { lat: bar.indirizzo.lat, lng: bar.indirizzo.lng };
      document.getElementById('indirizzo').innerHTML = `${vm.bar.indirizzo.addressHTML}`;
    })
    .then(() => {
      Client
        .query()
        .$promise
        .then(clients => {
          if (vm.bar.richiestaTotale && vm.bar.richiestaTotale.contanti) {
            vm.richiestaContanti = vm.bar.richiestaTotale.contanti;
          } else {
            vm.richiestaContanti = '';
          }

          vm.clients = clients;
          vm.clientsWhoHaveSeen = [];
          for (var i = 0; i < vm.bar.clienti.length; i++) {
            vm.clientsWhoHaveSeen.push(`${vm.bar.clienti[i].id}`);
          }
        })
        .then(() => {
          for (var i = 0; i < vm.clients.length; i++) {
            const client = vm.clients[i];
            if (client.importoInvestimento && client.importoInvestimento.anticipo) {
              if (!vm.clientsWhoHaveSeen.includes(`${client.id}`) && parseFloat(vm.richiestaContanti) === parseFloat(client.importoInvestimento.anticipo) && `${client.tipologiaAttivita.name}` === `${vm.bar.tipologiaAttivita.name}`) {
                vm.potentialClients.push(client);
              }
            }
          }
        });
    });

  function comment() {
    const user = CurrentUserService.currentUser.id;
    vm.comment.createdBy = user;

    Bar
      .addComment({ id: $stateParams.id }, vm.comment)
      .$promise
      .then(() => {
        vm.comment = '';
        vm.bar = Bar.get({ id: $stateParams.id });
      });
  }

  function deleteComm(comment) {
    Bar
      .deleteComment({ id: $stateParams.id, commentId: comment._id })
      .$promise
      .then(() => {
        Bar
          .get({ id: $stateParams.id })
          .$promise
          .then(bar => vm.bar = bar);
      });
  }

  function archive() {
    Bar
      .archiveBar({ id: $stateParams.id }, vm.bar)
      .$promise
      .then(() => $state.go('barsIndex'));
  }

  function expandDetails() {
    if (vm.expandedDetails) {
      vm.expandedDetails = false;
    } else {
      vm.expandedDetails = true;
    }
  }
}
