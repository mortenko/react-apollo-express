import models from "../../../db/models";
import { SELECT_ORDERS, COUNT_ALL_ORDERS } from "../raw-queries/order";
import { customErrorResponse } from "../utils/error_handler";

const OrderResolvers = {
  Query: {
    orders: async (_, { cursor, pageNumber }) => {
      const offset = (pageNumber - 1) * cursor;
      try {
        const selectOrders = await models.sequelize.query(SELECT_ORDERS, {
          replacements: { limit: 12, offset },
          type: models.sequelize.QueryTypes.SELECT
        });
        const [{ count }] = await models.sequelize.query(COUNT_ALL_ORDERS, {
          type: models.sequelize.QueryTypes.SELECT
        });
        const orders = selectOrders.map(
          ({
            orderItemID,
            orderID,
            totalsumwithoutdph,
            totalsumwithdph,
            quantity,
            createdAt,
            updatedAt,
            customerID,
            firstname,
            lastname,
            email,
            productID,
            productname
          }) => {
            return {
              orderItemID,
              orderID,
              totalsumwithoutdph,
              totalsumwithdph,
              quantity,
              createdAt,
              updatedAt,
              customer: {
                customerID,
                firstname,
                lastname,
                email
              },
              product: {
                productID,
                productname
              }
            };
          }
        );
        return { orders, count };
      } catch (fetchOrdersError) {
        customErrorResponse("Orders not founded", 404, fetchOrdersError);
      }
    }
    // order: (_, { id }) => {
    //   return models.Order.find({
    //     include: [
    //       {
    //         model: models.Customer,
    //         attributes: ["firstname", "lastname"],
    //         required: true
    //       },
    //       {
    //         model: models.OrderItem,
    //         attributes: ["quantity", "totalsumwithoutdph", "totalsumwithdph"],
    //         required: true
    //       }
    //     ],
    //     where: {
    //       orderID: id
    //     },
    //     attributes: ["orderID", "createdAt"]
    //   });
    // }
  }
  // Mutation: {
  //   deleteOrder: (_, { orderID }) => {
  //     models.Order.destroy({
  //       where: {
  //         orderID
  //       }
  //     });
  //   }
  //  }
};
export default OrderResolvers;
