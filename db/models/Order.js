module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define("Order", {
    orderID: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    customerID: {
      type: DataTypes.INTEGER,
      references: {
        model: "Customer",
        key: "customerID",
        deferrable: sequelize.Deferrable.INITIALLY_IMMEDIATE
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      validate: {
        isDate: true
      },
      updatedAt: {
        type: DataTypes.DATE,
        validate: {
          isDate: true
        }
      }
    }
  });
  Order.associate = models => {
    Order.belongsTo(models.Customer, {
      foreignKey: "customerID",
      onDelete: "cascade",
      hooks: "true"
    });
    Order.belongsToMany(models.OrderItem, {
      through: "OrderItem",
      foreignKey: "orderID",
      onDelete: "cascade",
      hooks: "true"
    });
  };
  return Order;
};

// export default class Order extends Model {
//   static init(sequelize) {
//     super.init(
//       {
//         orderID: {
//           allowNull: false,
//           autoIncrement: true,
//           primaryKey: true,
//           type: Sequelize.INTEGER
//         },
//         timeorder: {
//           type: Sequelize.DATE,
//           validate: {
//             isDate: true
//           }
//         },
//         customerID: {
//           type: Sequelize.INTEGER,
//           references: {
//             model: "Customer",
//             key: "customerID",
//             deferrable: sequelize.Deferrable.INITIALLY_IMMEDIATE
//           }
//         }
//       },
//       { sequelize, timestamps: false }
//     );
//   }
//   static associate(models) {
//     this.belongsTo(models.Customer, { foreignKey: "customerID", onDelete: "cascade", hooks: "true" });
//     this.hasOne(models.OrderItem, { foreignKey: "orderID", onDelete: "cascade", hooks: "true" });
//   }
// }
