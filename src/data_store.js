const path = require('path')
const { Sequelize } = require('sequelize')

const dataStore = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(path.dirname(__dirname), 'data/database.sqlite')
})

module.exports = dataStore
