const faker = require("faker");

module.exports = {
  up(queryInterface) {
    const productData = [];
    function generateProduct() {
      const price = faker.commerce.price();
      return {
        productname: `${faker.commerce.productName()}_${faker.random
          .uuid()
          .substring(1, 3)}`,
        description: faker.lorem.sentence(),
        pricewithoutdph: price,
        pricewithdph: Number(price * 1.35).toFixed(2),
        barcode: faker.random.uuid(),
        createdAt: faker.date.recent(),
        updatedAt: faker.date.past()
      };
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
