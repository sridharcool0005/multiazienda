angular.module('multiazienda').controller('HomeCtrl', HomeCtrl);

HomeCtrl.$inject = ['Client', 'Bar', '$window', '$scope', '$compile'];

/* global google:ignore */

function HomeCtrl(Client, Bar, $window, $scope, $compile) {
  const vm = this;
  vm.all = [];

  Client.query().$promise.then(clients => {
    Bar.query()
      .$promise.then(bars => {
        return bars.concat(clients);
      })
      .then(all => {
        var infoWindow = new google.maps.InfoWindow();

        const map = new $window.google.maps.Map(
          document.getElementById('google-map'),
          {
            zoom: 14,
            center: new google.maps.LatLng(51.515113, -0.072051),
            scrollwheel: false,
            styles: [
              { elementType: 'geometry', stylers: [{ saturation: -100 }] },
              {
                elementType: 'labels.text.stroke',
                stylers: [{ color: '#FFFFFF' }]
              },
              {
                elementType: 'labels.text.fill',
                stylers: [{ color: '#242f3e' }]
              }
            ]
          }
        );

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            function(position) {
              console.log(position.coords.latitude);
              console.log(position.coords.longitude);
              var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              };
              map.setCenter(pos);
            },
            function() {
              handleLocationError(true, infoWindow, map.getCenter());
            }
          );
        } else {
          // Browser doesn't support Geolocation
          console.log(navigator.geolocation);
          handleLocationError(false, infoWindow, map.getCenter());
        }

        function handleLocationError(browserHasGeolocation, infoWindow, pos) {
          infoWindow.setPosition(pos);
          infoWindow.setContent(
            browserHasGeolocation
              ? 'Errore: Il servizio di geolocation non funziona.'
              : 'Errore: Il tuo browser non supporta il servizio di geolocation.'
          );
          infoWindow.open(map);
        }

        function createInfoWindow(marker, content) {
          if (infoWindow) infoWindow.close();

          const compiledContent = $compile(content)($scope);

          infoWindow = new google.maps.InfoWindow({
            content: compiledContent[0]
          });

          infoWindow.open(map, marker);
        }

        all.forEach(thing => {
          let marker;
          let contentString;
          if (thing.nome) {
            marker = new google.maps.Marker({
              position: new google.maps.LatLng(
                thing.indirizzo.lat,
                thing.indirizzo.lng
              ),
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

            contentString = `
              <div class="info-window">
                <a ui-sref="clientShow({id: '${thing.id}'})">
                  <h3>${thing.nome} ${thing.cognome}</h3>
                </a>
                <p>${thing.indirizzo.addressFormatted}</p>
                <p>Cerca: ${thing.tipologiaAttivita.name}</p>
              </div>
              `;
          } else {
            marker = new google.maps.Marker({
              position: new google.maps.LatLng(
                thing.indirizzo.lat,
                thing.indirizzo.lng
              ),
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

            contentString = `
              <div class="info-window">
                <a ui-sref="barShow({id: '${thing.id}'})">
                  <h3>${thing.denominazioneAttivita}</h3>
                </a>
                <p>${thing.indirizzo.addressFormatted}</p>
                <p>Tipologia: ${thing.tipologiaAttivita.name}</p>
              </div>
              `;
          }

          marker.addListener('click', () => {
            createInfoWindow(marker, contentString);
          });
        });
      });
  });
}
