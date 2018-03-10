const faker = require("faker");

module.exports = {
  up(queryInterface) {
    const productPhotoData = [];
    function generateProductPhoto(i) {
      const ProductPhoto = {
        productID: i,
        filename: faker.system.fileName(),
        filetype: faker.image.avatar(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      };
      return ProductPhoto;
    }
    for (let i = 1; i <= 20; i++) {
      productPhotoData.push(generateProductPhoto(i));
    }
    return queryInterface.bulkInsert("ProductPhotos", productPhotoData);
  },
  down(queryInterface) {
    return queryInterface.bulkDelete("ProductPhotos");
  }
};
