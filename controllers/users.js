const User = require('../models/user');

function usersIndex(req, res) {
  User.find()
    .exec()
    .then(users => {
      if (!users) return res.status(404).json({ message: 'Users not found' });
      return res.status(200).json(users);
    })
    .catch(err => res.status(500).json(err));
}

function usersEdit(req, res) {
  User.findById(req.params.id)
    .exec()
    .then(user => {
      if (!user) return res.status(404).json({ message: 'User not found.' });

      for (const field in req.body) {
        user[field] = req.body[field];
      }

      user.save();

      return res.status(200).json(user);
    })
    .catch(err => res.status(500).json(err));
}

function usersShow(req, res) {
  User.findById(req.params.id, (err, user) => {
    if (err) return res.status(500).json({ message: 'Something went wrong.' });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    return res.status(200).json(user);
  });
}

module.exports = {
  index: usersIndex,
  edit: usersEdit,
  show: usersShow
};
