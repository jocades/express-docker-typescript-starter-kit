// Commands:
// migrate-mongo init - Initialize migrate-mongo in your project
// migrate-mongo create <migration-name> - Create a new migration file
// migrate-mongo up - Run pending migrations
// migrate-mongo down - Revert the last run migration
// migrate-mongo status - Show the status of the migrations

// In this file you can configure migrate-mongo
const config = {
  mongodb: {
    url: 'mongodb://localhost',

    databaseName: 'express-ts',

    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

  // The migrations dir, can be an relative or absolute path. Only edit this when really necessary.
  migrationsDir: 'migrations',

  // The mongodb collection where the applied changes are stored. Only edit this when really necessary.
  changelogCollectionName: 'changelog',

  // The file extension to create migrations and search for in migration dir
  migrationFileExtension: '.js',

  // Enable the algorithm to create a checksum of the file contents and use that in the comparison to determine
  // if the file should be run.  Requires that scripts are coded to be run multiple times.
  useFileHash: false,

  // Don't change this, unless you know what you're doing
  moduleSystem: 'commonjs',
}

module.exports = config
