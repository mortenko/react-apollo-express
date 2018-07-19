module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable("ProductPhotos", {
      productPhotoID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      productID: {
        type: Sequelize.INTEGER,
        onDelete: "cascade",
        references: {
          model: "Products",
          key: "productID",
          deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        }
      },
      photo: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable("ProductPhotos");
  }
};
