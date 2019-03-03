import { differenceBy, range } from "lodash";
import models from "../../../db/models";
import { SELECT_ORDERS, COUNT_ALL_ORDERS } from "../raw-queries/order";
import {
  errorResponse,
  successResponse,
  customErrorValidationResponse
} from "../utils/response_handler";

const OrderResolvers = {
  Query: {
    orders: async (_, { cursor, pageNumber }) => {
      const offset = (pageNumber - 1) * cursor;
      try {
        const getOrders = models.sequelize.query(SELECT_ORDERS, {
          replacements: { limit: 12, offset },
          type: models.sequelize.QueryTypes.SELECT
        });
        const countOrders = models.sequelize.query(COUNT_ALL_ORDERS, {
          type: models.sequelize.QueryTypes.SELECT
        });
        const [selectOrders, [{ count }]] = await Promise.all([
          getOrders,
          countOrders
        ]);

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
        errorResponse(
          "Orders does not match rows in DB",
          404,
          fetchOrdersError
        );
      }
    },
    fetchOrdersByID: async (_, { orderID }) => {
      try {
        const getTotalSum = models.OrderItem.findOne({
          attributes: [
            [
              models.sequelize.fn(
                "sum",
                models.sequelize.col("totalsumwithoutdph")
              ),
              "totalsumwithouthdph"
            ],
            [
              models.sequelize.fn(
                "sum",
                models.sequelize.col("totalsumwithdph")
              ),
              "totalsumwithdph"
            ]
          ],
          where: { orderID }
        });
        const getProductsByOrderID = models.OrderItem.findAll({
          attributes: [["quantity", "selectedQuantity"]],
          include: [
            {
              model: models.Product,
              required: true,
              attributes: [
                "productID",
                "productname",
                "pricewithoutdph",
                "pricewithdph"
              ]
            },
            {
              model: models.Order,
              required: true,
              attributes: ["customerID"],
              include: [
                {
                  model: models.Customer,
                  required: true,
                  attributes: ["firstname", "lastname", "email"]
                }
              ],
              where: {
                orderID
              }
            }
          ],
          where: {
            orderID
          },
          order: ["orderItemID"]
        });
        const [
          {
            dataValues: { totalsumwithouthdph, totalsumwithdph }
          },
          productsByOrderID
        ] = await Promise.all([getTotalSum, getProductsByOrderID]);

        const formatProductsByOrderID = productsByOrderID.reduce(
          (
            acc,
            {
              dataValues: {
                selectedQuantity,
                Product: {
                  dataValues: {
                    productID,
                    productname,
                    pricewithoutdph,
                    pricewithdph
                  }
                },
                Orders
              }
            }
          ) => {
            if (!acc["products"]) {
              acc["products"] = [];
            }
            acc["products"] = acc["products"].concat([
              {
                productID: `productname_ ${productID}`,
                productname,
                pricewithoutdph,
                pricewithdph,
                totalpricewithoutdph: pricewithoutdph * selectedQuantity,
                totalpricewithdph: pricewithdph * selectedQuantity,
                selectedQuantity,
                quantityRange: range(1, 10)
              }
            ]);
            Orders.forEach(
              ({
                dataValues: {
                  Customer: {
                    dataValues: { firstname, lastname, email }
                  }
                }
              }) => {
                acc["firstname"] = firstname;
                acc["lastname"] = lastname;
                acc["email"] = email;
                // return acc;
              }
            );
            acc["totalsumwithoutdph"] = totalsumwithouthdph;
            acc["totalsumwithdph"] = totalsumwithdph;
            return acc;
          },
          {}
        );
        return successResponse(
          {
            order: formatProductsByOrderID
          },
          200,
          "Fetched orders by orderID was successfull"
        );
      } catch (fetchOrdersByIDError) {
        return errorResponse(
          "Cant fetch orders by orderID from DB",
          404,
          fetchOrdersByIDError
        );
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
  },
  Mutation: {
    createOrder: async (_, { order }) => {
      const { email, totalsumwithdph, totalsumwithoutdph, products } = order;
      try {
        // find customerID by email
        const {
          dataValues: { customerID }
        } = await models.Customer.findOne({
          attributes: ["customerID"],
          where: { email }
        });
        try {
          const getOrderID = await models.Order.create({ customerID });
          //create new Order for given customer
          //get productname in array
          const getProductsName = products.map(
            ({ productname }) => productname
          );
          const getProductIDs = models.Product.findAndCountAll({
            attributes: ["productID", "productname"],
            where: {
              productname: {
                [models.Sequelize.Op.in]: getProductsName
              }
            }
          });
          // execute parallel promises
          const [
            {
              dataValues: { orderID }
            },
            { count, rows: productsFromDB }
          ] = await Promise.all([getOrderID, getProductIDs]);

          // check if products in  user's order are valid against DB result
          const diffArrayProductID = differenceBy(
            products,
            productsFromDB.map(({ dataValues: { productID, productname } }) => {
              return { productID, productname };
            }),
            "productname"
          ).reduce((acc, { productID, productname }) => {
            acc[productID] = {
              isExist: `product with name ${productname} does not exist`
            };
            return acc;
          }, {});
          // if products in order sent by user are wrong send error to frontend
          if (getProductsName.length !== count) {
            return customErrorValidationResponse(
              "product does not exist",
              diffArrayProductID
            );
          }
          try {
            const bulkOrder = productsFromDB.map(
              ({ dataValues: { productID, productname } }, index) => {
                return {
                  productID,
                  productname,
                  orderID,
                  quantity: products[index]["selectedQuantity"],
                  totalsumwithoutdph,
                  totalsumwithdph
                };
              }
            );
            await models.OrderItem.bulkCreate(bulkOrder);
            const formatProductsResponse = productsFromDB.map(
              ({ productID, productname }, index) => {
                return {
                  productID,
                  productname,
                  selectedQuantity: products[index]["selectedQuantity"]
                };
              }
            );
            return successResponse(
              {
                order: {
                  orderID,
                  products: formatProductsResponse,
                  totalsumwithoutdph,
                  totalsumwithdph
                }
              },
              200,
              "New order was successfully created"
            );
          } catch (createOrderError) {
            return errorResponse(
              "Cant insert new order into DB",
              500,
              createOrderError
            );
          }
        } catch (createNewOrderID) {
          return errorResponse(
            `Can't create new Order with customerID: ${customerID}`,
            500,
            createNewOrderID
          );
        }
      } catch (findByEmailError) {
        return customErrorValidationResponse(
          findByEmailError.message,
          {
            email: { isEmail: "Email address does not exist or is not valid" }
          },
          findByEmailError
        );
      }
    },
    deleteOrder: async (_, { orderID }) => {
      try {
        await models.Order.destroy({
          where: {
            orderID
          }
        });
        return successResponse(
          {
            order: {
              orderID
            }
          },
          200,
          "Order was successfully deleted"
        );
      } catch (deleteOrderError) {
        return errorResponse(
          "Can't delete order from DB",
          500,
          deleteOrderError
        );
      }
    }
  }
};
export default OrderResolvers;
