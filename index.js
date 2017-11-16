const express = require('express');
const mongoose = require('mongoose');
const bluebird = require('bluebird');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const expressJWT = require('express-jwt');
const app = express();
const env = app.get('env');
const { port, db, secret } = require('./config/environment');
const routes = require('./config/routes');
const dest = `${__dirname}/public`;

mongoose.connect(db[env]);
mongoose.Promise = bluebird;

if (app.get('env') !== 'production') app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static(dest));

app.use('/api', expressJWT({ secret: secret })
  .unless({
    path: [
      { url: '/api/login', methods: ['POST'] }
    ]
  })
);

app.use(jwtErrorHandler);

function jwtErrorHandler(err, req, res, next) {
  if (err.name !== 'UnauthorizedError') return next();

  return res.status(401).json({ message: 'Unauthorized request'});
}

app.use('/api', routes);
app.get('/*', (req, res) => res.sendFile(`${dest}/index.html`));

app.listen(port, () => console.log(`express is up and running on port ${port}`));

module.exports = app;
