const User = require('../models/user');

function usersShow(req, res) {
  User
    .findById(req.params.id, (err, user) => {
      if (err) return res.status(500).json({ message: 'Something went wrong.' });
      if (!user) return res.status(404).json({ message: 'User not found.' });

      return res.status(200).json(user);
    });
}

module.exports = {
  show: usersShow
};
