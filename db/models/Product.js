module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define("Product", {
    productID: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING,
      validate: {
        isLength: { min: 5, max: 30 }
      }
    },
    description: {
      type: DataTypes.TEXT,
      validate: {
        isLength: { min: 10, max: 150 }
      }
    },
    pricewithoutdph: {
      type: DataTypes.DECIMAL,
      validate: {
        isDecimal: true
      }
    },
    pricewithdph: {
      type: DataTypes.DECIMAL,
      validate: {
        isDecimal: true
      }
    },
    barcode: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: true
      }
    }
  });
  Product.associate = models => {
    Product.hasOne(models.ProductPhoto, { foreignKey: "productID", onDelete: "cascade", hooks: "true" });
    Product.belongsToMany(models.OrderItem, {
      foreignKey: "productID",
      through: "ProductOrderItem",
      onDelete: "cascade",
      hooks: "true"
    });
  };
  return Product;
};

// export default class Product extends Model {
//   static init(sequelize) {
//     super.init(
//       {
//         productID: {
//           allowNull: false,
//           autoIncrement: true,
//           primaryKey: true,
//           type: Sequelize.INTEGER
//         },
//         name: {
//           type: Sequelize.STRING,
//           validate: {
//             [Op.between]: [5, 20]
//           }
//         },
//         description: {
//           type: Sequelize.TEXT,
//           validate: {
//             [Op.between]: [10, 100]
//           }
//         },
//         pricewithoutdph: {
//           type: Sequelize.DECIMAL,
//           validate: {
//             isDecimal: true
//           }
//         },
//         pricewithdph: {
//           type: Sequelize.DECIMAL,
//           validate: {
//             isDecimal: true
//           }
//         },
//         barcode: {
//           type: Sequelize.INTEGER,
//           validate: {
//             isInt: true
//           }
//         }
//       },
//       { sequelize }
//     );
//   }
//   static associate(models) {
//     this.hasOne(models.ProductPhoto, { foreignKey: "productID", onDelete: "cascade", hooks: "true" });
//     this.belongsToMany(models.OrderItem, {
//       foreignKey: "productID",
//       through: "ProductOrderItem",
//       onDelete: "cascade",
//       hooks: "true"
//     });
//   }
// }
