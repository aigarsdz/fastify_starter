import database from '#database'
import BaseModel from '#models/base_model'
import TwoFactorSecret from '#models/two_factor_secret'

class User extends BaseModel {
  id = 0
  username = ''
  password = ''
  twoFactorAuthEnabled = 0
  createdAt = null
  updatedAt = null

  #twoFactorSecret = null

  get has2FA() {
    return Boolean(this.twoFactorAuthEnabled)
  }

  get twoFactorSecret() {
    if (!this.#twoFactorSecret) {
      this.#twoFactorSecret = new TwoFactorSecret(this.id)
    }

    return this.#twoFactorSecret
  }

  constructor(userId) {
    super()

    if (userId) {
      const user = database.prepare('SELECT * FROM users WHERE id = ?').get(userId)

      this.assignValues(user)
    }
  }

  create() {
    if (this.id > 0) {
      throw new Error('A user that has a valid ID cannot be created again.')
    }

    const date = new Date()
    const dateValue = date.toISOString().replace('T', ' ').split('.')[0]

    this.updatedAt = dateValue
    this.createdAt = dateValue

    const result = database.prepare(
      'INSERT INTO users (username, password, createdAt, updatedAt) VALUES (?, ?, ?, ?) RETURNING id'
    ).get(this.username, this.password, this.createdAt, this.updatedAt)

    this.id = result.id
  }

  update() {
    database.prepare(
      'UPDATE users SET username = ?, twoFactorAuthEnabled = ?, updatedAt = ? WHERE id = ?'
    ).run(this.username, this.twoFactorAuthEnabled, this.updatedAt, this.id)
  }

  static fromUsername(username) {
    const result = database.prepare('SELECT * FROM users WHERE username = ?').get(username)
    const user = new User()

    user.assignValues(result)

    return user
  }
}

export default User