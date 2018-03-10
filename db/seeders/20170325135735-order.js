const faker = require("faker");

module.exports = {
  up(queryInterface, Sequelize) {
    const OrderData = [];
    function generateOrder() {
      const Order = {
        customerID: faker.random.number({
          min: 1,
          max: 15
        }),
        timeorder: faker.date.future()
      };
      return Order;
    }
    for (let i = 1; i <= 15; i++) {
      OrderData.push(generateOrder());
    }
    return queryInterface.bulkInsert("Orders", OrderData);
  },
  down(queryInterface) {
    return queryInterface.bulkDelete("Orders");
  }
};
