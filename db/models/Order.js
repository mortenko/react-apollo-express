import Sequelize, { Model } from "sequelize";

export default class Order extends Model {
  static init(sequelize) {
    super.init(
      {
        orderID: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        timeorder: {
          type: Sequelize.DATE,
          validate: {
            isDate: true
          }
        },
        customerID: {
          type: Sequelize.INTEGER,
          references: {
            model: "Customer",
            key: "customerID",
            deferrable: sequelize.Deferrable.INITIALLY_IMMEDIATE
          }
        }
      },
      { sequelize, timestamps: false }
    );
  }
  static associate(models) {
    this.belongsTo(models.Customer, { foreignKey: "customerID", onDelete: "cascade", hooks: "true" });
    this.hasOne(models.OrderItem, { foreignKey: "orderID", onDelete: "cascade", hooks: "true" });
  }
}

// module.exports = (sequelize, DataTypes) => {
//   const Order = sequelize.define("Order", {
//     timestamps: false,
//     orderID: {
//       allowNull: false,
//       autoIncrement: true,
//       primaryKey: true,
//       type: DataTypes.INTEGER
//     },
//     timeorder: {
//       type: DataTypes.DATE,
//       validate: {
//         isDate: true
//       }
//     },
//     customerID: {
//       type: DataTypes.INTEGER,
//       references: {
//         model: "Customer",
//         key: "customerID",
//         deferrable: sequelize.Deferrable.INITIALLY_IMMEDIATE
//       }
//     }
//   });
//   Order.associate = models => {
//     Order.belongsTo(models.Customer, { foreignKey: "customerID", onDelete: "cascade", hooks: "true" });
//     Order.hasOne(models.OrderItem, { foreignKey: "orderID", onDelete: "cascade", hooks: "true" });
//   };
//   return Order;
// };
