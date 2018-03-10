module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable("Orders", {
      orderID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      customerID: {
        type: Sequelize.INTEGER,
        references: {
          model: "Customers",
          key: "customerID",
          deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        },
        onDelete: "CASCADE"
      },
      timeorder: {
        type: Sequelize.STRING
      }
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable("Orders");
  }
};
