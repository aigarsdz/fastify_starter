const { DataTypes, Model } = require('sequelize')
const dataStore = require('../data_store')

class User extends Model {}

User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    unique: true,
    primaryKey: true,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize: dataStore,
  modelName: 'User',
  tableName: 'users'
})

module.exports = User
