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
  Location
    .findOne({ locationId: req.body.locationId })
    .then(location => {
      if (!location) {
        Location
          .create(req.body)
          .then(location => {
            res.status(201).json(location);
          })
          .catch(err => res.status(500).json(err));
      } else {
        res.status(301).json({ message: 'location already exists'});
      }
    });
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

module.exports = {
  index: locationsIndex,
  create: locationsCreate,
  update: locationsUpdate,
  show: locationsShow
};
