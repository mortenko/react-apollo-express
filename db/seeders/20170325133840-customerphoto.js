const faker = require("faker");

module.exports = {
  up(queryInterface) {
    const customerPhotoData = [];
    function generateCustomerPhoto(i) {
      const CustomerPhoto = {
        customerID: i,
        filename: faker.system.fileName(),
        filetype: faker.image.avatar(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      };
      return CustomerPhoto;
    }
    for (let i = 1; i <= 20; i++) {
      customerPhotoData.push(generateCustomerPhoto(i));
    }
    return queryInterface.bulkInsert("CustomerPhotos", customerPhotoData);
  },
  down(queryInterface) {
    return queryInterface.bulkDelete("CustomerPhotos");
  }
};
