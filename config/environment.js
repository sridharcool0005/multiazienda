module.exports = {
  port: process.env.PORT || 4000,
  db: {
    development: 'mongodb://localhost/multiazienda-dev',
    production:
      process.env.MONGODB_URI || 'mongodb://localhost/multiazienda-production'
  },
  secret: process.env.SECRET || "shh it's a secret",
  env: process.env.NODE_ENV || 'development',
  access: {
    user1: {
      email: process.env.ADMIN_EMAIL1,
      password: process.env.ADMIN_PASSWORD1,
      username: process.env.ADMIN_USERNAME1
    },
    user2: {
      email: process.env.ADMIN_EMAIL2,
      password: process.env.ADMIN_PASSWORD2,
      username: process.env.ADMIN_USERNAME2
    },
    user3: {
      email: process.env.ADMIN_EMAIL3,
      password: process.env.ADMIN_PASSWORD3,
      username: process.env.ADMIN_USERNAME3
    }
  }
};
