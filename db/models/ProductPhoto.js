module.exports = (sequelize, DataTypes) => {
  const ProductPhoto = sequelize.define("ProductPhoto", {
    productPhotoID: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    productID: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: "Product",
        key: "productID",
        deferrable: sequelize.Deferrable.INITIALLY_IMMEDIATE
      }
    },
    photo: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "Photo is required"
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  ProductPhoto.associate = models => {};
  return ProductPhoto;
};

// export default class ProductPhoto extends Model {
//   static init(sequelize) {
//     super.init(
//       {
//         productPhotoID: {
//           allowNull: false,
//           autoIncrement: true,
//           primaryKey: true,
//           type: Sequelize.INTEGER
//         },
//         productID: {
//           allowNull: false,
//           type: Sequelize.INTEGER,
//           references: {
//             model: "Product",
//             key: "productID",
//             deferrable: sequelize.Deferrable.INITIALLY_IMMEDIATE
//           }
//         },
//         filename: {
//           type: Sequelize.STRING,
//           validate: {
//             [Op.between]: [3, 10]
//           }
//         },
//         filetype: {
//           type: Sequelize.BLOB
//         }
//       },
//       { sequelize }
//     );
//   }
//
//   static associate(models) {
//     // ProductPhoto.hasOne(models.ProductPage, { onDelete: 'cascade', hooks: 'true' })
//   }
// }
