import models from "../../../db/models";
import { ApolloError } from "apollo-server";

const ProductResolvers = {
  Query: {
    products: async (_, { cursor, pageNumber }) => {
      const offset = (pageNumber - 1) * cursor;
      try {
        const { rows: products, count } = await models.Product.findAndCountAll({
          order: ["productID"],
          include: {
            model: models.ProductPhoto,
            attributes: ["photo", "name"],
            required: true
          },
          offset,
          limit: 12,
          attributes: [
            "productID",
            "name",
            "description",
            "pricewithoutdph",
            "pricewithdph",
            "barcode",
            "createdAt"
          ]
        });
        return { products, count };
      } catch (fetchProductsError) {
        throw new ApolloError(fetchProductsError, 500);
      }
    },
    product: (_, { id }) => {
      return models.Product.find({
        where: {
          productID: id
        },
        attributes: [
          "productID",
          "name",
          "description",
          "pricewithoutdph",
          "pricewithdph",
          "barcode"
        ]
      });
    }
  },
  Mutation: {
    createProduct: (
      _,
      {
        input: {
          name,
          description,
          pricewithoutdph,
          pricewithdph,
          barcode,
          photo
        }
      }
    ) => {
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
    updateProduct: (
      _,
      {
        productID,
        input: {
          name,
          description,
          pricewithoutdph,
          pricewithdph,
          barcode,
          photo
        }
      }
    ) => {
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
