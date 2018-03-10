module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('CustomerPhotos', {
      customerPhotoID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      customerID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Customers',
          key: 'customerID',
          deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
        },
      },
      filename: {
        type: Sequelize.STRING,
      },
      filetype: {
        type: Sequelize.BLOB,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('CustomerPhotos');
  }
};
