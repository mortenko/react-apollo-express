module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define("Customer", {
    customerID: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    firstname: {
      type: DataTypes.STRING,
      validate: {
        isLength: {
          args: { min: 3, max: 15 },
          msg: "firstname must have at least 3 and max 15 characters"
        }
      }
    },
    lastname: {
      type: DataTypes.STRING,
      validate: {
        isLength: {
          args: { min: 3, max: 15 },
          msg: "lastname must have at least 3 and max 15 characters"
        }
      }
    },
    phone: {
      type: DataTypes.STRING,
      validate: {
        isMobilePhone: {
          args: "any",
          msg: "Phone number is not valid"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: "Email was already taken"
      },
      validate: {
        isEmail: {
          args: {
            is: !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
          },
          msg: "Email is not valid"
        }
      }
    }
  });
  Customer.associate = function(models) {
    Customer.hasOne(models.CustomerPhoto, {
      foreignKey: "customerID",
      onDelete: "cascade",
      hooks: "true"
    });
    Customer.hasMany(models.Order, { onDelete: "cascade", hooks: "true" });
  };
  return Customer;
};

// export default class Customer extends Model {
//   static init(sequelize) {
//     super.init(
//       {
//         customerID: {
//           allowNull: false,
//           autoIncrement: true,
//           primaryKey: true,
//           type: Sequelize.INTEGER
//         },
//         firstname: {
//           type: Sequelize.STRING,
//           validate: {
//             [Op.between]: [3, 10]
//           }
//         },
//         lastname: {
//           type: Sequelize.STRING,
//           validate: {
//             [Op.between]: [3, 10]
//           }
//         },
//         phone: {
//           type: Sequelize.STRING
//         },
//         email: {
//           type: Sequelize.STRING,
//           unique: true,
//           validate: {
//             isEmail: true
//           }
//         }
//       },
//       { sequelize }
//     );
//   }
//
//   static associate(models) {
//     this.hasOne(models.CustomerPhoto, { foreignKey: "customerID", onDelete: "cascade", hooks: "true" });
//     this.hasMany(models.Order, { onDelete: "cascade", hooks: "true" });
//   }
// }
