const faker = require("faker");
module.exports = {
  up(queryInterface) {
    const orderItemData = [];
    function generateOrderItem(i) {
      const OrderItem = {
        quantity: faker.random.number({
          min: 1,
          max: 5
        }),
        totalsumwithoutdph: faker.commerce.price() * 0.5,
        totalsumwithdph: faker.commerce.price() * 1.5,
        productID: faker.random.number({
          min: 1,
          max: 20
        }),
        orderID: i,
        createdAt: faker.date.future(),
        updatedAt: faker.date.future()
      };
      return OrderItem;
    }
    for (let i = 1; i <= 15; i++) {
      orderItemData.push(generateOrderItem(i));
    }
    return queryInterface.bulkInsert("OrderItems", orderItemData);
  },

  down(queryInterface) {
    return queryInterface.bulkDelete("OrderItems");
  }
};
