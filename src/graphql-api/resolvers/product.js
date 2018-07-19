const models = require("../../../db/models");

const ProductResolvers = {
  Query: {
    products: (_, { cursor }) => {
      return models.Product.findAndCountAll({
        include: {
          model: models.ProductPhoto,
          attributes: ["productPhotoID", "photo"],
          required: true
        },
        offset: cursor,
        limit: 10,
        attributes: ["productID", "name", "description", "pricewithoutdph", "pricewithdph", "barcode"]
      }).then(response => {
        return response.rows;
      });
    },
    product: (_, { id }) => {
      return models.Product.find({
        where: {
          productID: id
        },
        attributes: ["productID", "name", "description", "pricewithoutdph", "pricewithdph", " barcode"]
      });
    }
  },
  Mutation: {
    createProduct: (_, { input: { name, description, pricewithoutdph, pricewithdph, barcode, photo } }) => {
      const newProduct = {
        name,
        description,
        pricewithoutdph,
        pricewithdph,
        barcode
      };
      models.Product.create(newProduct);
      models.Product.afterCreate((product, options) => {
        const { productID } = product.dataValues;
        models.ProductPhoto.create({
          productID,
          photo
        });
      });
    },
    updateProduct: (_, { productID, input: { name, description, pricewithoutdph, pricewithdph, barcode, photo } }) => {
      const updateProduct = {
        name,
        description,
        pricewithoutdph,
        pricewithdph,
        barcode
      };
      models.Product.update(updateProduct, {
        where: {
          productID
        },
        individualHooks: true
      });
      models.Product.afterUpdate((user, options) => {
        models.ProductPhoto.update(
          { photo },
          {
            where: {
              productID
            }
          }
        );
      });
    },
    deleteProduct: (_, { productID }) => {
      models.Product.destroy({
        where: {
          productID
        }
      });
    }
  }
};

export default ProductResolvers;
