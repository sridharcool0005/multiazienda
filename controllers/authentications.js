const jwt = require('jsonwebtoken');
const config = require('../config/environment');
const User = require('../models/user');

function authLogin(req, res){
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) return res.status(500).json({ message: 'Something went wrong.' });
    if (!user || !user.validatePassword(req.body.password)) {
      return res.status(401).json({ message: 'Unauthorized.' });
    }

    const token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 60*60*24 });

    return res.status(200).json({
      message: 'Welcome back.',
      user,
      token
    });
  });
}

module.exports = {
  login: authLogin
};
