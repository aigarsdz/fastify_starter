const database = require('../database')
const BaseModel = require('./base_model')

class User extends BaseModel {
  id = 0
  username = ''
  password = ''
  createdAt = null
  updatedAt = null

  constructor(userId = 0) {
    super()

    if (userId == 0) {
      throw new Error('The user id must be an integer greater than 0.')
    }

    const user = database.prepare('SELECT * FROM users WHERE id = ?').get(userId)

    this.assignValues(user)
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
      'UPDATE users SET username = ?, updatedAt = ? WHERE id = ?'
    ).run(this.username, this.updatedAt, this.id)
  }

  static fromUsername(username) {
    const result = database.prepare('SELECT * FROM users WHERE username = ?').get(username)
    const user = new User()

    user.assignValues(result)

    return user
  }
}

module.exports = User