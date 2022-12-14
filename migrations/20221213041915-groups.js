module.exports = {
  async up(db, client) {
    await db.collection('groups').insertMany([
      { name: 'Group 1', description: 'Group 1 description', privacy: 0 },
      { name: 'Group 2', description: 'Group 2 description', privacy: 1 },
      { name: 'Group 3', description: 'Group 3 description', privacy: 0 },
      { name: 'Group 4', description: 'Group 4 description', privacy: 1 },
      { name: 'Group 5', description: 'Group 5 description', privacy: 0 },
    ])
  },

  async down(db, client) {
    await db.collection('groups').deleteMany({
      name: {
        $in: ['Group 1', 'Group 2', 'Group 3', 'Group 4', 'Group 5'],
      },
    })
  },
}
