exports.up = async function(knex) {
  await knex.raw(
		`
			CREATE TABLE two_factor_secrets (
				id INTEGER PRIMARY KEY,
				userID INTEGER NOT NULL UNIQUE,
				code TEXT NOT NULL,
				temporaryCode TEXT,
				createdAt TEXT NOT NULL,
				updatedAt TEXT NOT NULL,

				FOREIGN KEY(userID) REFERENCES users(id)
			)
		`
  )

  await knex.raw('CREATE INDEX users_id_index ON two_factor_secrets(userID)')
}

exports.down = async function(knex) {
  await knex.raw('DROP INDEX users_id_index')
  await knex.raw('DROP TABLE two_factor_secrets')
}
