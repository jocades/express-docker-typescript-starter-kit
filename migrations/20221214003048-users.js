const bcrypt = require('bcrypt')

module.exports = {
  async up(db, client) {
    await db.collection('users').insertMany([
      {
        email: 'admin@m.com',
        password: await bcrypt.hash('123456', 10),
        firstName: 'admin1',
        lastName: 'last1',
        isAdmin: true,
      },
      {
        email: 'user1@m.com',
        password: await bcrypt.hash('123456', 10),
        firstName: 'name2',
        lastName: 'last2',
      },
      {
        email: 'user2@m.com',
        password: await bcrypt.hash('123456', 10),
        firstName: 'name3',
        lastName: 'last3',
      },
    ])
  },

  async down(db, client) {
    db.collection('users').deleteMany({})
  },
}
