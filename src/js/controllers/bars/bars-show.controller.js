angular.module('multiazienda').controller('BarShowCtrl', BarShowCtrl);

BarShowCtrl.$inject = [
  'Bar',
  'Client',
  '$stateParams',
  '$window',
  'CurrentUserService',
  '$state',
  '$rootScope',
  '$timeout',
  '$q'
];

function BarShowCtrl(
  Bar,
  Client,
  $stateParams,
  $window,
  CurrentUserService,
  $state,
  $rootScope,
  $timeout,
  $q
) {
  const vm = this;

  vm.potentialClients = [];
  vm.addComment = comment;
  vm.deleteComment = deleteComm;
  vm.archive = archive;
  vm.expandDetails = expandDetails;
  vm.expandedDetails = false;

  $q.all({
    clients: Client.query().$promise,
    bar: Bar.get({ id: $stateParams.id }).$promise
  })
    .then(data => {
      vm.bar = data.bar;

      const clients = data.clients;

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
        client.typeStringArray = client.typeString.split(', ');
        if (client.importoInvestimento && client.importoInvestimento.anticipo) {
          if (
            !vm.clientsWhoHaveSeen.includes(`${client.id}`) &&
            parseFloat(vm.richiestaContanti) ===
              parseFloat(client.importoInvestimento.anticipo) &&
            client.typeStringArray.includes(`${vm.bar.tipologiaAttivita.name}`)
          ) {
            vm.potentialClients.push(client);
          }
        }
      }
    });

  function comment() {
    if (vm.commentForm.$valid) {
      const user = CurrentUserService.currentUser.id;
      vm.comment.createdBy = user;

      Bar.addComment({ id: $stateParams.id }, vm.comment).$promise.then(() => {
        vm.comment = {};
        vm.commentForm.$setPristine();
        vm.bar = Bar.get({ id: $stateParams.id });
      });
    }
  }

  function deleteComm(comment) {
    Bar.deleteComment({
      id: $stateParams.id,
      commentId: comment._id
    }).$promise.then(() => {
      Bar.get({ id: $stateParams.id }).$promise.then(bar => (vm.bar = bar));
    });
  }

  function archive(addOrRemove) {
    Bar.archiveBar({ id: $stateParams.id }, vm.bar).$promise.then(() => {
      if (addOrRemove === 'aggiungi') {
        $state.go('archive', { clientOrBar: 'bars' });
      } else {
        $state.go('barsIndex');
      }
    });
  }

  function expandDetails() {
    vm.expandedDetails
      ? (vm.expandedDetails = false)
      : (vm.expandedDetails = true);
  }
}
