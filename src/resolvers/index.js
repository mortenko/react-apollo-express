import models from "../../db/models";

const resolvers = {
  Query: {
    customers: (_,args) => {
      return models.Customer.findAndCountAll({
        limit: 5,
        offset: 0,
        attributes: ["customerID", "firstname", "lastname", "phone", "email"],
        order: '"customerID"',
        // include: [
        //   {
        //     model: models.CustomerPhoto,
        //     attributes: ["filename"],
        //     // if true inner join otherwise left join
        //     required: true
        //   }
        // ]
      });
    },
    products: (_,args) => {
      return models.Product.findAndCountAll({
        limit: 5,
        offset: 0,
        attributes: ["productID", "name", "description", "pricewithoutdph", "pricewithdph", "barcode"],
        order: '"productID"',
        include: [
          {
            model: models.ProductPhoto,
            attributes: ["filename"],
            // if true inner join otherwise left join
            required: true
          }
        ]
      });
    }
  }
};
export default resolvers;