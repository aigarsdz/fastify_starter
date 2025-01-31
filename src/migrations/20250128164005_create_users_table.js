exports.up = async function(knex) {
  await knex.raw(
		`
			CREATE TABLE users (
				id INTEGER PRIMARY KEY,
				username TEXT NOT NULL UNIQUE,
				password TEXT NOT NULL,
				createdAt TEXT NOT NULL,
				updatedAt TEXT NOT NULL
			)
		`
  )

  await knex.raw('CREATE INDEX users_username_index ON users(username)')
}

exports.down = async function(knex) {
  await knex.raw('DROP INDEX users_username_index')
  await knex.raw('DROP TABLE users')
}
