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
    .populate('attivitaViste.bar attivitaViste.comments.createdBy')
    .then(client => {
      if(!client) return res.status(404).json({ message: 'No client found!'});
      const activity = client.attivitaViste.id(req.params.barId);

      return res.status(200).json(activity);
    })
    .catch(err => res.status(500).json(err));
}

function attivitaVisteUpdate(req, res) {
  Client
    .findById(req.params.id)
    .then(client => {
      if (!client) return res.status(404).json({message: 'No client found'});
      const attivita = client.attivitaViste.id(req.params.barId);
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
      const attivita = client.attivitaViste.id(req.params.barId);

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
