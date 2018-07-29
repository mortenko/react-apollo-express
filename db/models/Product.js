module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define("Product", {
    productID: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    productname: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: "Product with this name already exists"
      },
      validate: {
        isLength: {
          args: { min: 5, max: 20 },
          msg: "product name must have at least 5 and max 20 characters"
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      validate: {
        isLength: {
          arg: { min: 20, max: 150 },
          msg:
            "product description must have at least 20 and max 150 characters"
        }
      }
    },
    //TODO need to handle that  pricewithoutdph must be less then pricewithdph
    pricewithoutdph: {
      type: DataTypes.DECIMAL,
      validate: {
        isDecimal: {
          args: true,
          msg: "pricewithoutdph is not decimal number"
        }
      }
    },
    pricewithdph: {
      type: DataTypes.DECIMAL,
      validate: {
        isDecimal: {
          args: true,
          msg: "pricewithdph is not decimal number"
        }
      }
    },
    barcode: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: {
        args: true,
        msg: "barcode already exists"
      },
      validate: {
        isUUID: {
          args: 4,
          msg: "barcode is not type of UUID4"
        }
      }
    }
  });
  Product.associate = models => {
    Product.hasOne(models.ProductPhoto, {
      foreignKey: "productID",
      onDelete: "cascade",
      hooks: "true"
    });
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
