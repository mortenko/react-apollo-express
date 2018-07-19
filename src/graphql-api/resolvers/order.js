const models = require("../../../db/models");

const OrderResolvers = {
  Query: {
    orders: (_, { cursor }) => {
      return models.Order.findAndCountAll({
        include: [
          {
            model: models.OrderItem,
            attributes: ["quantity", "totalsumwithoutdph", "totalsumwithdph"],
            required: false
          },
          {
            model: models.Customer,
            attributes: ["firstname", "lastname"],
            required: false
          }
        ],
        offset: cursor,
        limit: 10,
        attributes: ["orderID", "createdAt"]
      }).then(response => {
        return response.rows;
      });
    },
    order: (_, { id }) => {
      return models.Order.find({
        include: [
          {
            model: models.Customer,
            attributes: ["firstname", "lastname"],
            required: true
          },
          {
            model: models.OrderItem,
            attributes: ["quantity", "totalsumwithoutdph", "totalsumwithdph"],
            required: true
          }
        ],
        where: {
          orderID: id
        },
        attributes: ["orderID", "createdAt"]
      });
    }
  },
  Mutation: {
    deleteOrder: (_, { orderID }) => {
      models.Order.destroy({
        where: {
          orderID
        }
      });
    }
  }
};
export default OrderResolvers;
