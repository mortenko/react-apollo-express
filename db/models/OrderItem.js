module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define("OrderItem", {
    orderItemID: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    productID: {
      type: DataTypes.INTEGER,
      references: {
        model: "Product",
        key: "productID",
        deferrable: sequelize.Deferrable.INITIALLY_IMMEDIATE
      }
    },
    orderID: {
      type: DataTypes.INTEGER,
      references: {
        model: "Order",
        key: "orderID",
        deferrable: sequelize.Deferrable.INITIALLY_IMMEDIATE
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: true
      }
    },
    totalsumwithoutdph: {
      type: DataTypes.DECIMAL,
      validate: {
        isDecimal: true
      }
    },
    totalsumwithdph: {
      type: DataTypes.DECIMAL,
      validate: {
        isDecimal: true
      }
    }
  });
  OrderItem.associate = models => {
    OrderItem.belongsTo(models.Product, { foreignKey: "productID", onDelete: "cascade", hooks: "true" });
    OrderItem.hasMany(models.Order, { foreignKey: "orderID", onDelete: "cascade", hooks: "true" });
  };
  return OrderItem;
};

// export default class OrderItem extends Model {
//   static init(sequelize) {
//     super.init(
//       {
//         orderItemID: {
//           allowNull: false,
//           autoIncrement: true,
//           primaryKey: true,
//           type: Sequelize.INTEGER
//         },
//         quantity: {
//           type: Sequelize.INTEGER,
//           validate: {
//             isInt: true
//           }
//         },
//         totalsumwithoutdph: {
//           type: Sequelize.DECIMAL,
//           validate: {
//             isDecimal: true
//           }
//         },
//         totalsumwithdph: {
//           type: Sequelize.DECIMAL,
//           validate: {
//             isDecimal: true
//           }
//         },
//         productID: {
//           type: Sequelize.INTEGER,
//           references: {
//             model: "Product",
//             key: "productID",
//             deferrable: sequelize.Deferrable.INITIALLY_IMMEDIATE
//           }
//         },
//         orderID: {
//           type: Sequelize.INTEGER,
//           references: {
//             model: "Order",
//             key: "orderID",
//             deferrable: sequelize.Deferrable.INITIALLY_IMMEDIATE
//           }
//         }
//       },
//       { sequelize }
//     );
//   }
//   static associate(models) {
//     this.belongsTo(models.Product, { foreignKey: "productID", onDelete: "cascade", hooks: "true" });
//     this.hasMany(models.Order, { foreignKey: "orderID", onDelete: "cascade", hooks: "true" });
//   }
// }
