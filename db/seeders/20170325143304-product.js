const faker = require("faker");

module.exports = {
  up(queryInterface) {
    const productData = [];
    function generateProduct() {
      const Product = {
        name: faker.commerce.productName(),
        description: faker.lorem.text(),
        pricewithoutdph: faker.commerce.price(),
        pricewithdph: faker.commerce.price() * 1.2,
        barcode: faker.random.number(),
        createdAt: faker.date.future(),
        updatedAt: faker.date.future()
      };
      return Product;
    }
    for (let i = 1; i <= 150; i++) {
      productData.push(generateProduct());
    }
    return queryInterface.bulkInsert("Products", productData);
  },

  down(queryInterface) {
    return queryInterface.bulkDelete("Products");
  }
};
