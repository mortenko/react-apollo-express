import models from "../../../db/models";
import { ApolloError, UserInputError } from "apollo-server";
import path from "path";
import { collectServerErrors, savePhoto } from "../utils/helper";

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
            "productname",
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
    createProduct: async (_, { photoFile, product }) => {
      try {
        const { dataValues: { productID } } = await models.Product.create(
          product
        );
        const rootPath = path.resolve("./public");
        const productPath = path.join(rootPath, "/photos/products");
        const productPhotoDir = path.join(productPath, productID.toString());
        try {
          const filename = await savePhoto(photoFile, productPhotoDir);
          try {
            await models.ProductPhoto.create({
              productID,
              photo: `/photos/products/${productID}/${filename}`,
              name: `${filename}`
            });
          } catch (productPhotoError) {
            throw new UserInputError(JSON.stringify(productPhotoError));
          }
        } catch (savePhotoFileError) {
          throw savePhotoFileError;
        }
      } catch (createProductError) {
        console.log(createProductError);
        //const serverErrors = collectServerErrors(createProductError);
        //throw new UserInputError(JSON.stringify(serverErrors));
      }
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

