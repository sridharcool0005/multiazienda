angular
  .module('multiazienda')
  .controller('HomeCtrl', HomeCtrl);

HomeCtrl.$inject = ['Client', 'Bar', '$window'];

/* global google:ignore */

function HomeCtrl(Client, Bar, $window) {
  const vm = this;
  console.log('HOME');
  vm.all = [];

  Client
    .query()
    .$promise
    .then(clients => {
      Bar
        .query()
        .$promise
        .then(bars => {
          return bars.concat(clients);
        })
        .then(all => {
          const map = new $window.google.maps.Map(document.getElementById('google-map'), {
            zoom: 6,
            center: new google.maps.LatLng(51.515113, -0.072051),
            scrollwheel: false,
            styles: [
              { 'elementType': 'geometry', 'stylers': [{ 'saturation': -100 }]},
              { 'elementType': 'labels.text.stroke', 'stylers': [{'color': '#FFFFFF'}]},
              { 'elementType': 'labels.text.fill', 'stylers': [{'color': '#242f3e'}]}
            ]
          });

          const infoWindow = new google.maps.InfoWindow;

          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
              var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              };
              map.setCenter(pos);

            }, function() {
              handleLocationError(true, infoWindow, map.getCenter());
            });
          } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
          }

          function handleLocationError(browserHasGeolocation, infoWindow, pos) {
            infoWindow.setPosition(pos);
            infoWindow.setContent(browserHasGeolocation ?
              'Error: The Geolocation service failed.' :
              'Error: Your browser doesn\'t support geolocation.');
            infoWindow.open(map);
          }

          all.forEach(thing => {
            let marker;
            let contentString;
            if (thing.nome) {
              marker = new google.maps.Marker({
                position: new google.maps.LatLng(thing.indirizzo.lat, thing.indirizzo.lng),
                icon: {
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 5,
                  fillColor: '#d80019',
                  fillOpacity: 1,
                  strokeColor: '#d80019',
                  strokeWeight: 4,
                  strokeOpacity: 0.6
                },
                draggable: true,
                map: map
              });

              contentString =
              `
              <div class="info-window">
                <a ui-sref="clientShow({id: ${thing.id})" href="/clients/${thing.id}">
                  <h3>${thing.nome} ${thing.cognome}</h3>
                </a>
                <p>${thing.indirizzo.addressFormatted}</p>
                <p>Cerca: ${thing.tipologiaAttivita.name}</p>
              </div>
              `;
            } else {
              marker = new google.maps.Marker({
                position: new google.maps.LatLng(thing.indirizzo.lat, thing.indirizzo.lng),
                icon: {
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 5,
                  fillColor: '#808080',
                  fillOpacity: 1,
                  strokeColor: '#808080',
                  strokeWeight: 4,
                  strokeOpacity: 0.6
                },
                draggable: true,
                map: map
              });

              contentString =
              `
              <div class="info-window">
                <a ui-sref="barShow({id: ${thing.id})" href="/bars/${thing.id}">
                  <h3>${thing.denominazioneAttivita}</h3>
                </a>
                <p>${thing.indirizzo.addressFormatted}</p>
                <p>Tipologia: ${thing.tipologiaAttivita.name}</p>
              </div>
              `;
            }

            const infowindow = new google.maps.InfoWindow({
              content: contentString
            });

            marker.addListener('click', function() {
              infowindow.open(map, marker);
            });
          });
        });
    });
}
