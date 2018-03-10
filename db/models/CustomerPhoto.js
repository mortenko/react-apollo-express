import Sequelize, { Model, Op } from "sequelize";

export default class CustomerPhoto extends Model {
  static init(sequelize) {
    super.init(
      {
        customerPhotoID: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        customerID: {
          allowNull: false,
          type: Sequelize.INTEGER,
          references: {
            model: "Customer",
            key: "customerID",
            deferrable: sequelize.Deferrable.INITIALLY_IMMEDIATE
          }
        },
        filename: {
          type: Sequelize.STRING,
          validate: {
            [Op.between]: [3, 15]
          }
        },
        filetype: {
          type: Sequelize.BLOB
        }
      },
      { sequelize }
    );
  }
  static associate(models) {
    //  CustomerPhoto.hasOne(models.CustomerPage, { onDelete: 'cascade', hooks: 'true' })
  }
}

// module.exports = (sequelize, DataTypes) => {
//     const CustomerPhoto = sequelize.define("CustomerPhoto", {
//         customerPhotoID: {
//             allowNull: false,
//             autoIncrement: true,
//             primaryKey: true,
//             type: DataTypes.INTEGER
//         },
//         customerID: {
//             allowNull: false,
//             type: DataTypes.INTEGER,
//             references: {
//                 model: "Customer",
//                 key: "customerID",
//                 deferrable: sequelize.Deferrable.INITIALLY_IMMEDIATE
//             }
//         },
//         filename: {
//             type: DataTypes.STRING,
//             validate: {
//                 len: [3, 15]
//             }
//         },
//         filetype: {
//             type: DataTypes.BLOB
//         }
//     });
//
//     CustomerPhoto.associate = models => {
//         //  CustomerPhoto.hasOne(models.CustomerPage, { onDelete: 'cascade', hooks: 'true' })
//     };
//     return CustomerPhoto;
// };
