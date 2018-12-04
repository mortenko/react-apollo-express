const faker = require("faker");

module.exports = {
  up(queryInterface) {
    const orderItemData = [];
    function generateOrderItem() {
      const quantity = faker.random.number({
        min: 1,
        max: 5
      });
      const price = faker.commerce.price() * quantity;
      return {
        quantity,
        totalsumwithoutdph: price,
        totalsumwithdph: price * 1.5,
        productID: faker.random.number({
          min: 1,
          max: 150
        }),
        orderID: faker.random.number({
          min: 1,
          max: 50
        }),
        createdAt: faker.date.future(),
        updatedAt: faker.date.future()
      };
    }
    for (let i = 1; i <= 50; i++) {
      orderItemData.push(generateOrderItem());
    }
    return queryInterface.bulkInsert("OrderItems", orderItemData);
  },

  down(queryInterface) {
    return queryInterface.bulkDelete("OrderItems");
  }
};
