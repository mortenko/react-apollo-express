module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('Products', {
      productID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      productname: {
        type: Sequelize.STRING,
        unique: true
      },
      description: {
        type: Sequelize.TEXT,
      },
      pricewithoutdph: {
        type: Sequelize.DECIMAL,
      },
      pricewithdph: {
        type: Sequelize.DECIMAL,
      },
      barcode: {
        type: Sequelize.UUID,
        unique: true
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
    return queryInterface.dropTable('Products');
  }
};
