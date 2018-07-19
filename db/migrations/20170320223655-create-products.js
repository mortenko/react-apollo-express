module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('Products', {
      productID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
          type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
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
        type: Sequelize.INTEGER,
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