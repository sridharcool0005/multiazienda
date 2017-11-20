const mongoose = require('mongoose');
const config = require('../config/environment');
const express = require('express');
const app = express();
const env = app.get('env');

mongoose.Promise = require('bluebird');

const dbURL = config.db[env];

mongoose.connect(dbURL, { useMongoClient: true });

const User = require('../models/user');
const Bar = require('../models/bar');
const Client = require('../models/client');
const Location = require('../models/location');
const Zone = require('../models/zone');
const Type = require('../models/type');

// User.collection.drop();
// Location.collection.drop();
// Bar.collection.drop();
// Client.collection.drop();
// Zone.collection.drop();
// Type.collection.drop();

User.create([
  {
    username: config.access.user1.username,
    email: config.access.user1.email,
    password: config.access.user1.password,
    passwordConfirmation: config.access.user1.password
  },
  {
    username: config.access.user2.username,
    email: config.access.user2.email,
    password: config.access.user2.password,
    passwordConfirmation: config.access.user2.password
  },
  {
    username: config.access.user3.username,
    email: config.access.user3.email,
    password: config.access.user3.password,
    passwordConfirmation: config.access.user3.password
  }
])
  .then(users => {
    console.log(`${users.length} users were created!`);

    return Zone.create([
      {
        name: 'Bologna Centro'
      },
      {
        name: 'Bologna Levante'
      },
      {
        name: 'Bologna Ponente'
      },
      {
        name: 'Bologna Provincia'
      },
      {
        name: 'Modena e Provincia'
      },
      {
        name: 'Reggio e Provincia'
      },
      {
        name: 'Parma e Provincia'
      },
      {
        name: 'Ravenna/Forli e Provincia'
      }
    ]).then(zones => {
      console.log(`${zones.length} zones were created!`);

      return Type.create([
        {
          name: 'Bar'
        },
        {
          name: 'Bar Tabacchi'
        },
        {
          name: 'Bar Ristorante'
        },
        {
          name: 'Bar Gelateria'
        },
        {
          name: 'Pub'
        },
        {
          name: 'Gelateria'
        },
        {
          name: 'Tabaccheria'
        },
        {
          name: 'Ristorante'
        },
        {
          name: 'Ristorante Pizzeria'
        },
        {
          name: 'Pizzerie'
        },
        {
          name: 'Sala Giochi'
        },
        {
          name: 'Rosticceria'
        }
      ]);
    });
  })
  .then(types => console.log(`${types.length} types were created!`))
  .catch(err => console.log(err))
  .finally(() => mongoose.connection.close());
