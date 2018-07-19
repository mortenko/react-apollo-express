module.exports = (sequelize, DataTypes) => {
  const CustomerPhoto = sequelize.define("CustomerPhoto", {
    customerPhotoID: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    customerID: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: "Customer",
        key: "customerID",
        deferrable: sequelize.Deferrable.INITIALLY_IMMEDIATE
      }
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: false,
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

  CustomerPhoto.associate = models => {};
  return CustomerPhoto;
};

// export default class CustomerPhoto extends Model {
//   static init(sequelize) {
//     super.init(
//       {
//         customerPhotoID: {
//           allowNull: false,
//           autoIncrement: true,
//           primaryKey: true,
//           type: Sequelize.INTEGER
//         },
//         customerID: {
//           allowNull: false,
//           type: Sequelize.INTEGER,
//           references: {
//             model: "Customer",
//             key: "customerID",
//             deferrable: sequelize.Deferrable.INITIALLY_IMMEDIATE
//           }
//         },
//         filename: {
//           type: Sequelize.STRING,
//           validate: {
//             [Op.between]: [3, 15]
//           }
//         },
//         filetype: {
//           type: Sequelize.BLOB
//         }
//       },
//       { sequelize }
//     );
//   }
//   static associate(models) {
//     //  CustomerPhoto.hasOne(models.CustomerPage, { onDelete: 'cascade', hooks: 'true' })
//   }
// }
