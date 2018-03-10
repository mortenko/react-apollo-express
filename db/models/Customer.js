import Sequelize, { Model, Op } from "sequelize";

export default class Customer extends Model {
  static init(sequelize) {
    super.init(
      {
        customerID: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        firstname: {
          type: Sequelize.STRING,
          validate: {
            [Op.between]: [3, 10]
          }
        },
        lastname: {
          type: Sequelize.STRING,
          validate: {
            [Op.between]: [3, 10]
          }
        },
        phone: {
          type: Sequelize.STRING
        },
        email: {
          type: Sequelize.STRING,
          unique: true,
          validate: {
            isEmail: true
          }
        }
      },
      { sequelize }
    );
  }

  static associate(models) {
    this.hasOne(models.CustomerPhoto, { foreignKey: "customerID", onDelete: "cascade", hooks: "true" });
    this.hasMany(models.Order, { onDelete: "cascade", hooks: "true" });
  }
}

// module.exports = (sequelize, DataTypes) => {
//   const Customer = sequelize.define("Customer", {
//     customerID: {
//       allowNull: false,
//       autoIncrement: true,
//       primaryKey: true,
//       type: DataTypes.INTEGER
//     },
//     firstname: {
//       type: DataTypes.STRING,
//       validate: {
//         len: [3, 10]
//       }
//     },
//     lastname: {
//       type: DataTypes.STRING,
//       validate: {
//         len: [3, 10]
//       }
//     },
//     phone: {
//       type: DataTypes.STRING
//     },
//     email: {
//       type: DataTypes.STRING,
//       unique: true,
//       validate: {
//         isEmail: true
//       }
//     }
//   });
//   Customer.associate = models => {
//     Customer.hasOne(models.CustomerPhoto, { foreignKey: "customerID", onDelete: "cascade", hooks: "true" });
//     Customer.hasMany(models.Order, { onDelete: "cascade", hooks: "true" });
//   };
//   return Customer;
// };
