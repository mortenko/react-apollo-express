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
    product: async (_, { productID }) => {
      try {
        return await models.Product.findById(productID, {
          include: {
            model: models.ProductPhoto,
            attributes: ["photo", "name"]
          },
          attributes: [
            "productID",
            "productname",
            "description",
            "pricewithoutdph",
            "pricewithdph",
            "barcode"
          ]
        });
      } catch (productFindByIdError) {
        throw new ApolloError(JSON.stringify(productFindByIdError), 400);
      }
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
    updateProduct: async (
      _,
      { photoFile, product: { productID, ...product } }
    ) => {
      const updateProductResponse = {};
      try {
        const productObj = await models.Product.update(product, {
          where: {
            productID
          },
          returning: true,
          individualHooks: true
        });
        const {
          createdAt,
          updatedAt,
          ...updatedProduct
        } = productObj[1][0].dataValues;
        updateProductResponse["product"] = { productID, ...updatedProduct };
      } catch (updateProductError) {
        console.log(updateProductError);
      }
      let photo = null;
      try {
        const {
          dataValues: { photo: productPhoto }
        } = await models.ProductPhoto.find({
          where: { productID },
          attributes: ["photo"]
        });
        console.log("productPhoto", productPhoto);
        photo = productPhoto;
      } catch (queryFindPhotoError) {
        throw new ApolloError(queryFindPhotoError, 500);
      }
      if (typeof photoFile === "string") {
        updateProductResponse["product"]["ProductPhoto"] = {
          photo,
          name: path.basename(photoFile)
        };
      } else if (typeof photoFile === "object") {
        const dirPath = path.resolve(`./public/photos/products/${productID}`);
        try {
          const filename = await savePhoto(photoFile, dirPath, photo);
          try {
            const response = await models.ProductPhoto.update(
              {
                photo: `photos/products/${productID}/${filename}`,
                name: filename
              },
              {
                returning: true,
                where: {
                  productID
                }
              }
            );
            const { photo } = response[1][0].dataValues;
            updateProductResponse["product"]["ProductPhoto"] = {
              photo,
              name: filename
            };
          } catch (productPhotoUpdateError) {
            throw new ApolloError(productPhotoUpdateError, 500);
          }
        } catch (savePhotoError) {
          console.log(savePhotoError);
          //   throw new ApolloError(savePhotoError, 500);
        }
      }
      return updateProductResponse;
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
