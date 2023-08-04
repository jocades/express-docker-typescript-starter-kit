module.exports = {
  async up(db, client) {
    await db.collection('groups').insertMany([
      {
        name: 'Group 1',
        description: 'Group 1 description',
        privacy: 'public',
        // longitute, latitude of palma de mallorca
        location: { type: 'Point', coordinates: [2.6496, 39.5696] },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Group 2',
        description: 'Group 2 description',
        privacy: 'private',
        // longitute, latitude of andratx, mallorca
        location: { type: 'Point', coordinates: [2.4933, 39.6017] },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Group 3',
        description: 'Group 3 description',
        privacy: 0,
        privacy: 'public',
        // longitute, latitude of pollenca, mallorca
        location: { type: 'Point', coordinates: [3.0375, 39.8561] },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Group 4',
        description: 'Group 4 description',
        privacy: 'private',
        // longitute, latitude of inca, mallorca
        location: { type: 'Point', coordinates: [2.8197, 39.5696] },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Group 5',
        description: 'Group 5 description',
        // longitute, latitude of sa pobla, mallorca
        location: { type: 'Point', coordinates: [2.7333, 39.7333] },
        privacy: 'public',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
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
