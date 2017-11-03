const Client = require('../models/client');
const Bar = require('../models/bar');

function attivitaVisteCreate(req, res) {
  Client
    .findById(req.params.id)
    .then(client => {
      if(!client) return res.status(404).json({ message: 'No client found!'});
      client.attivitaViste.push(req.body);
      client.save();

      Bar
        .findById(req.body.bar)
        .then(bar => {
          bar.clienti.push(req.params.id);
          bar.save();
        });
    })
    .then(client => res.status(200).json(client))
    .catch(err => res.status(500).json(err));
}

function attivitaVisteShow(req, res) {
  Client
    .findById(req.params.id)
    .populate('attivitaViste.bar')
    .then(client => {
      if(!client) return res.status(404).json({ message: 'No client found!'});
      for (var i = 0; i < client.attivitaViste.length; i++) {
        if (`${client.attivitaViste[i]._id}` === req.params.barId) {
          const attivita = client.attivitaViste[i];
          return res.status(200).json(attivita);
        }
      }
    })
    .catch(err => res.status(500).json(err));
}

function attivitaVisteUpdate(req, res) {
  Client
    .findById(req.params.id)
    .then(client => {
      if (!client) return res.status(404).json({message: 'No client found'});
      const attivita = client.attivitaViste.find(obj => obj.id);
      for (const field in req.body) {
        attivita[field] = req.body[field];
      }

      client.save();
    })
    .then(client => res.status(200).json(client))
    .catch(err => res.status(500).json(err));
}

function attivitaVisteDelete(req, res) {
  Client
    .findById(req.params.id)
    .then(client => {
      if (!client) return res.status(404).json({message: 'No client found'});
      const attivita = client.attivitaViste.find(obj => obj.id);

      attivita.remove();

      client.save();
    })
    .then(client => res.status(200).json(client))
    .catch(err => res.status(500).json(err));
}

module.exports = {
  create: attivitaVisteCreate,
  show: attivitaVisteShow,
  update: attivitaVisteUpdate,
  delete: attivitaVisteDelete
};
