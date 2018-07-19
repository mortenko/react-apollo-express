const faker = require("faker");

module.exports = {
  up(queryInterface) {
    const productPhotoData = [];
    function generateProductPhoto(i) {
      const ProductPhoto = {
        productID: i,
        photo: faker.image.image(),
        name: faker.random.word(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      };
      return ProductPhoto;
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
