const faker = require("faker");

module.exports = {
  up(queryInterface) {
    const customerPhotoData = [];
    function generateCustomerPhoto(i) {
      const CustomerPhoto = {
        customerID: i,
        photo: faker.image.avatar(),
        name: faker.random.word(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      };
      return CustomerPhoto;
    }
    for (let i = 1; i <= 100; i++) {
      customerPhotoData.push(generateCustomerPhoto(i));
    }
    return queryInterface.bulkInsert("CustomerPhotos", customerPhotoData);
  },
  down(queryInterface) {
    return queryInterface.bulkDelete("CustomerPhotos");
  }
};
