const faker = require("faker");

module.exports = {
  up(queryInterface) {
    const productPhotoData = [];
    function generateProductPhoto(i) {
      return {
        productID: i,
        photo: faker.image.cats(),
        name: faker.random.word(),
        createdAt: faker.date.recent(),
        updatedAt: faker.date.past()
      };
    }
    for (let i = 1; i <= 150; i++) {
      productPhotoData.push(generateProductPhoto(i));
    }
    return queryInterface.bulkInsert("ProductPhotos", productPhotoData);
  },
  down(queryInterface) {
    return queryInterface.bulkDelete("ProductPhotos");
  }
};
