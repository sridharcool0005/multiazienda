const mongoose = require('mongoose');
const config = require('../config/environment');

mongoose.Promise = require('bluebird');

const dbURL = config.db.development;

mongoose.connect(dbURL);

const User = require('../models/user');
const Bar = require('../models/bar');
const Client = require('../models/client');
const Location = require('../models/location');
const Zone = require('../models/zone');
const Type = require('../models/type');

User.collection.drop();
Location.collection.drop();
Bar.collection.drop();
Client.collection.drop();
Zone.collection.drop();
Type.collection.drop();

User
  .create([{
    username: 'multiazienda',
    email: 'm@m.com',
    password: 'pw',
    passwordConfirmation: 'pw'
  }])
  .then(users => {
    console.log(`${users.length} users were created!`);

    return Zone
      .create([{
        name: 'Bologna Centro'
      }, {
        name: 'Bologna Levante'
      }, {
        name: 'Bologna Ponente'
      }, {
        name: 'Bologna Provincia'
      }, {
        name: 'Modena e Provincia'
      }, {
        name: 'Reggio e Provincia'
      }, {
        name: 'Parma e Provincia'
      }, {
        name: 'Ravenna/Forli e Provincia'
      }])
      .then(zones => {
        console.log(`${zones.length} zones were created!`);

        return Type
          .create([{
            name: 'Bar'
          }, {
            name: 'Bar Tabacchi'
          }, {
            name: 'Bar Ristorante'
          }, {
            name: 'Bar Gelateria'
          }, {
            name: 'Pub'
          }, {
            name: 'Gelateria'
          }, {
            name: 'Tabaccheria'
          }, {
            name: 'Ristorante'
          }, {
            name: 'Ristorante Pizzeria'
          }, {
            name: 'Pizzerie'
          }, {
            name: 'Sala Giochi'
          }, {
            name: 'Rosticceria'
          }]);
      });
  })
  .then(types => console.log(`${types.length} types were created!`))
  .catch(err => console.log(err))
  .finally(() => mongoose.connection.close());



// return Bar
//   .create([{
//     codiceAttivita: 'c21',
//     denominazioneAttivita: 'Bar Ristoria Pizzorante',
//     titolareAttivita: 'Frengo'
//   }])
//   .then(bars => {
//     console.log(`${bars.length} bars were created!`);
//
//     return Client
//       .create([{
//         nome: 'John',
//         cognome: 'Oliver',
//         email: 'john.oliver@gmail.com',
//         attivitaViste: [{
//           data: new Date('11/10/89'),
//           bar: bars[0]
//         }]
//       }]);
//   });

// CLIENTS:

// {
// 	"nome": "John",
// 	"cognome": "Oliver",
// 	"indirizzo": "59f49637f3e95433b2b2333d",
//   "telefono": "+397854067723",
//   "email": "john.oliver@gmail.com",
//   "sab": "boh",
//   "tipologiaAttivita": "59f4aba65d95df37d806d853",
//   "zona": "59f4ad2a1f0977384b9c502a",
//   "importoInvestimento": {
//     "anticipo": 1000,
//     "totale": 2000
//   },
//   "esperienza": "nulla",
//   "note": '"text"'
// }


// BARS:

// {
//   "codiceAttivita": "c21",
//   "tipologiaAttivita": "59f4aba65d95df37d806d853",
//   "zona": "59f4ad2a1f0977384b9c502a",
//   "denominazioneAttivita": "Bar Ristoria Pizzorante",
//   "titolareAttivita": "Frengo",
//   "indirizzo": "59f49637f3e95433b2b2333d",
//   "referente": "Frengo",
//   "metriQuadrati": 40,
//   "magazzino": {
//     "presente": "si",
//     "internoEsterno": "interno"
//   },
//   "richiestaTotale": {
//     "contanti": "100p",
//     "dilazioni": "300"
//   },
//   "incassoGiornaliero": {
//     "minimo": 300,
//     "massimo": 400
//   },
//   "incassoAnnuale": {
//     "minimo": 2000,
//     "massimo": 2500
//   },
//   "canoneLocazione": {
//     "iva": "si",
//     "scadenza": 2015,
//     "depCauzionale": 500,
//     "speseCondominio": 200
//   },
//   "clienti": ["59f4af6f37807c38c489f937"]
// }


// 59f59d9f18298e41e61994b5 bar created
// 59f59deb297cdf41e30ccdcf bar 2 created
// 59f59f7da02a81424de36eb6 bar 3 created
// 59f59d9f18298e41e61994b6 client created
