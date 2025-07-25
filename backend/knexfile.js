// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const connection = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    }
  : {
      host: process.env.PGHOST || 'db',
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || 'postgres',
      database: process.env.PGDATABASE || 'postgres',
      port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432,
    };

module.exports = {
  development: {
    client: 'pg',
    connection,
    migrations: { tableName: 'knex_migrations' }
  },
  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'pg',
    connection,
    migrations: { tableName: 'knex_migrations' }
  },
  test: {
    client: 'pg',
    connection,
    migrations: { tableName: 'knex_migrations' }
  }

};
