const Type = require('../models/type');

function typesIndex(req, res) {
  Type
    .find()
    .then(types => {
      res.status(201).json(types);
    })
    .catch(err => res.status(500).json(err));
}

function typesShow(req, res) {
  Type
    .findById(req.params.id)
    .then(type => {
      res.status(201).json(type);
    })
    .catch(err => res.status(500).json(err));
}

function typesCreate(req, res) {
  Type
    .findOne({ name: req.body.name })
    .then(type => {
      if (!type) {
        Type
          .create(req.body)
          .then(type => {
            res.status(201).json(type);
          })
          .catch(err => res.status(500).json(err));
      } else {
        res.status(301).json({ message: 'type already exists'});
      }
    });
}

function typesUpdate(req, res) {
  Type
    .findById(req.params.id)
    .then(type => {
      for(const field in req.body) {
        type[field] = req.body[field];
      }

      type.save();
    })
    .then(type => res.status(200).json(type))
    .catch(err => res.status(500).json(err));
}

module.exports = {
  index: typesIndex,
  create: typesCreate,
  show: typesShow,
  update: typesUpdate
};
