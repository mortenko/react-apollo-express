const faker = require("faker");

module.exports = {
  up(queryInterface) {
    const OrderData = [];
    function generateOrder() {
      return {
        customerID: faker.random.number({
          min: 1,
          max: 100
        }),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent()
      };
    }
    for (let i = 1; i <= 50; i++) {
      OrderData.push(generateOrder());
    }
    return queryInterface.bulkInsert("Orders", OrderData);
  },
  down(queryInterface) {
    return queryInterface.bulkDelete("Orders");
  }
};
