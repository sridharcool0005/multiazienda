module.exports = {
  port: process.env.PORT || 4000,
  db: {
    development: 'mongodb://localhost/multiazienda-dev',
    production: process.env.MONGODB_URI || 'mongodb://localhost/multiazienda-production'
  },
  secret: process.env.SECRET || 'shh it\'s a secret'
};
