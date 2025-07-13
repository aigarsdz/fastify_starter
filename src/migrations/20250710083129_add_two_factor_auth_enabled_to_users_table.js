exports.up = async function(knex) {
  await knex.raw('ALTER TABLE users ADD COLUMN twoFactorAuthEnabled INTEGER DEFAULT 0')
}

exports.down = async function(knex) {
  await knex.raw('ALTER TABLE users DROP COLUMN twoFactorAuthEnabled')
}
