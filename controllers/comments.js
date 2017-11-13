const Bar = require('../models/bar');
const Client = require('../models/client');

function commentBarCreate(req, res) {
  Bar
    .findById(req.params.id)
    .exec()
    .then(bar => {
      if(!bar) return res.status(404).json({ message: 'No bar found!'});
      req.body.createdBy = req.user.id;
      bar.comments.push(req.body);
      bar.save();
    })
    .then(bar => res.status(200).json(bar))
    .catch(err => res.status(500).json(err));
}

function commentBarDelete(req, res) {
  Bar
    .findById(req.params.id)
    .exec()
    .then(bar => {
      if(!bar) return res.status(404).json({ message: 'No bar found!'});
      const comment = bar.comments.find(obj => obj.id);
      comment.remove();
      bar.save();
    })
    .then(bar => res.status(200).json(bar))
    .catch(err => res.status(500).json(err));
}

function commentClientCreate(req, res) {
  console.log(req.body);
  Client
    .findById(req.params.id)
    .exec()
    .then(client => {
      if(!client) return res.status(404).json({ message: 'No client found!'});
      console.log(req.user);
      req.body.createdBy = req.user.id;
      client.comments.push(req.body);
      client.save();
    })
    .then(client => res.status(200).json(client))
    .catch(err => res.status(500).json(err));
}

function commentClientDelete(req, res) {
  Client
    .findById(req.params.id)
    .exec()
    .then(client => {
      if(!client) return res.status(404).json({ message: 'No client found!'});
      const comment = client.comments.find(obj => obj.id);
      comment.remove();
      client.save();
    })
    .then(client => res.status(200).json(client))
    .catch(err => res.status(500).json(err));
}

function commentActivityCreate(req, res) {
  Client
    .findById(req.params.id)
    .exec()
    .then(client => {
      if(!client) return res.status(404).json({ message: 'No client found!'});
      const activity = client.attivitaViste.find(obj => obj.id);
      req.body.createdBy = req.user.id;
      activity.comments.push(req.body);
      client.save();
    })
    .then(client => res.status(200).json(client))
    .catch(err => res.status(500).json(err));
}

function commentActivityDelete(req, res) {
  Client
    .findById(req.params.id)
    .exec()
    .then(client => {
      if(!client) return res.status(404).json({ message: 'No client found!'});
      const activity = client.attivitaViste.find(obj => obj.id);
      const comment = activity.comments.find(obj => obj.id);
      comment.remove();
      client.save();
    })
    .then(client => res.status(200).json(client))
    .catch(err => res.status(500).json(err));
}

module.exports = {
  createBar: commentBarCreate,
  deleteBar: commentBarDelete,
  createClient: commentClientCreate,
  deleteClient: commentClientDelete,
  createActivity: commentActivityCreate,
  deleteActivity: commentActivityDelete
};
