const Location = require('../models/location');

function locationsIndex(req, res) {
  Location
    .find()
    .then(locations => {
      res.status(201).json(locations);
    })
    .catch(err => res.status(500).json(err));
}

function locationsShow(req, res) {
  Location
    .findById(req.params.id)
    .then(location => {
      res.status(201).json(location);
    })
    .catch(err => res.status(500).json(err));
}

function locationsCreate(req, res) {
  console.log('here');
  console.log(req.body);
  if (req.headers.referer.includes('attivita')) {
    req.body.type = 'attivita';
  } else {
    req.body.type = 'cliente';
  }
  Location
    .create(req.body)
    .then(location => {
      res.status(201).json(location);
    })
    .catch((err) => res.status(500).json({ message: err }));
}

function locationsUpdate(req, res) {
  Location
    .findById(req.params.id)
    .then(location => {
      for(const field in req.body) {
        location[field] = req.body[field];
      }

      location.save();
    })
    .then(location => res.status(200).json(location))
    .catch(err => res.status(500).json(err));
}

function locationsDelete(req, res) {
  Location
    .findById(req.params.id)
    .then(location => {
      location.remove();
    })
    .then(location => res.status(200).json(location))
    .catch(err => res.status(500).json(err));
}

module.exports = {
  index: locationsIndex,
  create: locationsCreate,
  update: locationsUpdate,
  show: locationsShow,
  delete: locationsDelete
};
