const Bar = require('../models/bar');
const Client = require('../models/client');

function indexClient(req, res) {

  Client
    .find({ archiviato: true })
    .populate('indirizzo zona tipologiaAttivita attivitaViste')
    .exec()
    .then(clients => res.status(201).json(clients))
    .catch(err => res.status(500).json(err));
}

function archiveClient(req, res) {
  // console.log(req.body);
  if (req.body.archiviato) {
    req.body.archiviato = false;
  } else {
    req.body.archiviato = true;
  }

  Client
    .findById(req.params.id)
    .exec()
    .then(client => {
      for(const field in req.body) {
        client[field] = req.body[field];
      }

      client.archiviato = req.body.archiviato;

      if (req.body.tipologiaAttivita.id) client.tipologiaAttivita = req.body.tipologiaAttivita.id;
      if (req.body.zona.id) client.zona = req.body.zona.id;
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

      return client.save();
    })
    .then(client => res.status(201).json(client))
    .catch(err => res.status(500).json(err));
}

function indexBar(req, res) {
  Bar
    .find({ archiviato: true })
    .populate('indirizzo zona tipologiaAttivita clienti')
    .exec()
    .then(bars => res.status(201).json(bars))
    .catch(err => res.status(500).json(err));
}

function archiveBar(req, res) {
  if (req.body.archiviato) {
    req.body.archiviato = false;
  } else {
    req.body.archiviato = true;
  }

  Bar
    .findById(req.params.id)
    .then(bar => {
      for(const field in req.body) {
        bar[field] = req.body[field];
      }

      bar.archiviato = req.body.archiviato;

      if (req.body.tipologiaAttivita) bar.tipologiaAttivita = req.body.tipologiaAttivita.id;
      if (req.body.zona) bar.zona = req.body.zona.id;
      bar.indirizzo = req.body.indirizzo.id;

      if (req.body.clienti.length > 0) {
        const clientIds = [];
        for (var i = 0; i < req.body.clienti.length; i++) {
          clientIds.push(req.body.clienti[i].id);
        }
        bar.clienti = clientIds;
      }

      if (bar.comments.length > 0) {
        for (var j = 0; j < bar.comments.length; j++) {
          bar.comments[j].createdBy = req.body.comments[j].createdBy.id;
        }
      }

      return bar.save();
    })
    .then(bar => res.status(200).json(bar))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
}

module.exports = {
  archiveClient: archiveClient,
  indexClient: indexClient,
  archiveBar: archiveBar,
  indexBar: indexBar
};
