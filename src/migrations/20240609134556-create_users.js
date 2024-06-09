module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
        unique: true,
        primaryKey: true,
        allowNull: false
      },
      username: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      updatedAt: Sequelize.DataTypes.DATE,
      createdAt: Sequelize.DataTypes.DATE
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users')
  }
}
