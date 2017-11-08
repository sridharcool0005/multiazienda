angular
  .module('multiazienda')
  .controller('BarShowCtrl', BarShowCtrl);

BarShowCtrl.$inject = ['Bar', 'Client', '$stateParams', '$window', 'CurrentUserService', '$state'];

function BarShowCtrl(Bar, Client, $stateParams, $window, CurrentUserService, $state) {
  const vm = this;

  vm.potentialClients = [];
  vm.addComment = comment;
  vm.deleteComment = deleteComm;
  vm.archive = archive;

  Bar
    .get({ id: $stateParams.id })
    .$promise
    .then(bar => {
      vm.bar = bar;

      document.getElementById('indirizzo').innerHTML = `<span>Indirizzo: </span>${vm.bar.indirizzo.addressHTML}`;

      vm.icon = {
        url: 'https://image.flaticon.com/icons/svg/33/33622.svg',
        scaledSize: new $window.google.maps.Size(50, 50)
      };
    })
    .then(() => {
      const map = new $window.google.maps.Map(document.getElementById('google-map'), {
        zoom: 14,
        center: { lat: vm.bar.indirizzo.lat, lng: vm.bar.indirizzo.lng },
        scrollwheel: false,
        styles: [
          { 'elementType': 'geometry', 'stylers': [{ 'saturation': -100 }]},
          { 'elementType': 'labels.text.stroke', 'stylers': [{'color': '#FFFFFF'}]},
          { 'elementType': 'labels.text.fill', 'stylers': [{'color': '#242f3e'}]}
        ]
      });

      new $window.google.maps.Marker({
        position: { lat: vm.bar.indirizzo.lat, lng: vm.bar.indirizzo.lng },
        map: map,
        title: 'Hello world',
        icon: vm.icon,
        animation: $window.google.maps.Animation.DROP
      });
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
}
