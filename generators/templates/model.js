const database = require('../database')
const BaseModel = require('./base_model')

class ModelName extends BaseModel {
  id = 0
  createdAt = null
  updatedAt = null

  constructor(id) {
    super()

    if (id) {
      const existingEntry = database.prepare('SELECT * FROM model_table WHERE id = ?').get(id)

      this.assignValues(existingEntry)
    }
  }

  create() {
    if (this.id > 0) {
      throw new Error('A ModelName that has a valid ID cannot be created again.')
    }

    const date = new Date()
    const dateValue = date.toISOString().replace('T', ' ').split('.')[0]

    this.updatedAt = dateValue
    this.createdAt = dateValue

    const result = database.prepare(
      'INSERT INTO model_table (createdAt, updatedAt) VALUES (?, ?) RETURNING id'
    ).get(this.createdAt, this.updatedAt)

    this.id = result.id
  }

  update() {
    database.prepare(
      'UPDATE model_table SET updatedAt = ? WHERE id = ?'
    ).run(this.updatedAt, this.id)
  }
}

module.exports = ModelName