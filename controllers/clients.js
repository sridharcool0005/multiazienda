const Client = require('../models/client');
const Bar = require('../models/bar');

function clientsIndex(req, res) {
  Client
    .find({ archiviato: false })
    .populate('indirizzo zona tipologiaAttivita attivitaViste')
    .then(clients => {
      res.status(201).json(clients);
    })
    .catch(err => res.status(500).json(err));
}

function clientsShow(req, res) {
  Client
    .findById(req.params.id)
    .populate('indirizzo zona tipologiaAttivita attivitaViste attivitaViste.bar comments.createdBy')
    .then(client => {
      res.status(201).json(client);
    })
    .catch(err => res.status(500).json(err));
}

function clientsCreate(req, res) {
  req.body.archiviato = false;
  Client
    .create(req.body)
    .then(client => {
      res.status(201).json(client);
    })
    .catch(err => res.status(500).json(err));
}

function clientsUpdate(req, res) {
  Client
    .findById(req.params.id)
    .then(client => {
      for(const field in req.body) {
        client[field] = req.body[field];
      }

      if (req.body.tipologiaAttivita) client.tipologiaAttivita = req.body.tipologiaAttivita.id;
      if (req.body.zona) client.zona = req.body.zona.id;
      if (req.body.indirizzo) client.indirizzo = req.body.indirizzo.id;

      if (client.attivitaViste.length > 0) {
        for (var i = 0; i < client.attivitaViste.length; i++) {
          client.attivitaViste[i].bar = req.body.attivitaViste[i].bar.id;
        }
      }

      if (client.comments.length > 0) {
        for (var j = 0; j < client.comments.length; j++) {
          client.comments[j].createdBy = req.body.comments[j].createdBy.id;
        }
      }

      return client;
    })
    .then(client => {
      return client.save();
    })
    .then(client => res.status(200).json(client))
    .catch(err => res.status(500).json(err));
}

function clientsDelete(req, res) {
  Client
    .findById(req.params.id)
    .then(client => {
      client.remove();

      Bar //once you remove the bar, also remove the bar form the ones seen by the clients
        .find()
        .then(bars => {
          for (var i = 0; i < bars.length; i++) {
            const singleBar = bars[i];

            for (var j = 0; j < singleBar.attivitaViste.length; j++) {
              const singleBar = singleBar.clienti[j];
              if (toString(singleBar.bar) === toString(req.params.id)) singleBar.remove();
            }

            return singleBar.save();
          }
        });
    })
    .then(bar => res.status(200).json(bar))
    .catch(err => res.status(500).json(err));
}

module.exports = {
  show: clientsShow,
  index: clientsIndex,
  create: clientsCreate,
  update: clientsUpdate,
  delete: clientsDelete
};
