module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable("OrderItems", {
      orderItemID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      productID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Products',
          key: 'productID',
          deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        },
        onDelete: 'CASCADE'
      },
      orderID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Orders',
          key: 'orderID',
          deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        },
        onDelete: "CASCADE"
      },
      quantity: {
        type: Sequelize.INTEGER
      },
      totalsumwithoutdph: {
        type: Sequelize.DECIMAL
      },
      totalsumwithdph: {
        type: Sequelize.DECIMAL
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable("OrderItems");
  }
};
