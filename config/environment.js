module.exports = {
  port: process.env.PORT || 4000,
  db: {
    development: 'mongodb://localhost/multiazienda-dev',
    production: process.env.MONGODB_URI || 'mongodb://localhost/multiazienda-production'
  },
  secret: process.env.SECRET || 'shh it\'s a secret',
  access: {
    user1: {
      email: process.env.ADMIN_EMAIL1,
      password: process.env.ADMIN_PASSWORD1
    },
    user2: {
      email: process.env.ADMIN_EMAIL2,
      password: process.env.ADMIN_PASSWORD2
    },
    user3: {
      email: process.env.ADMIN_EMAIL3,
      password: process.env.ADMIN_PASSWORD3
    }
  }
};
