const faker = require("faker");
module.exports = {
  up(queryInterface) {
    const customerData = [];

    function generateCustomer() {
      const Customer = {
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        phone: faker.phone.phoneNumber(),
        email: faker.internet.email(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      };
      return Customer;
    }

    for (let i = 1; i <= 100; i++) {
      customerData.push(generateCustomer());
    }
    return queryInterface.bulkInsert("Customers", customerData);
  },
  down(queryInterface) {
    return queryInterface.bulkDelete("Customers");
  }
};
