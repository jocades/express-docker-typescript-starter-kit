const bcrypt = require('bcrypt')

module.exports = {
  async up(db, client) {
    await db.collection('users').insertMany([
      {
        email: 'admin@m.com',
        password: await bcrypt.hash('123456', 10),
        firstName: 'admin1',
        lastName: 'last',
        isAdmin: true,
        createdAt: new Date(),
      },
      {
        email: 'user1@m.com',
        password: await bcrypt.hash('123456', 10),
        firstName: 'name1',
        lastName: 'last1',
        createdAt: new Date(),
      },
      {
        email: 'user2@m.com',
        password: await bcrypt.hash('123456', 10),
        firstName: 'name2',
        lastName: 'last2',
        createdAt: new Date(),
      },
    ])
  },

  async down(db, client) {
    db.collection('users').deleteMany({
      firstName: {
        $in: ['admin1', 'name1', 'name2'],
      },
    })
  },
}
