const Zone = require('../models/zone');

function zonesIndex(req, res) {
  Zone
    .find()
    .then(zones => {
      res.status(201).json(zones);
    })
    .catch(err => res.status(500).json(err));
}

function zonesShow(req, res) {
  Zone
    .findById(req.params.id)
    .then(zone => {
      res.status(201).json(zone);
    })
    .catch(err => res.status(500).json(err));
}

function zonesCreate(req, res) {
  Zone
    .findOne({ name: req.body.name })
    .then(zone => {
      if (!zone) {
        Zone
          .create(req.body)
          .then(zone => {
            res.status(201).json(zone);
          })
          .catch(err => res.status(500).json(err));
      } else {
        res.status(301).json({ message: 'zone already exists'});
      }
    });
}

function zonesUpdate(req, res) {
  Zone
    .findById(req.params.id)
    .then(zone => {
      for(const field in req.body) {
        zone[field] = req.body[field];
      }

      zone.save();
    })
    .then(zone => res.status(200).json(zone))
    .catch(err => res.status(500).json(err));
}

module.exports = {
  index: zonesIndex,
  create: zonesCreate,
  show: zonesShow,
  update: zonesUpdate
};
