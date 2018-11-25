import models from "../../../db/models";
import path from "path";
import { recursivelyRemoveFiles, savePhoto } from "../utils/helper";
import {
  validationErrorResponse,
  validationSuccessResponse,
  customErrorResponse
} from "../utils/error_handler";
import {
  asyncAccessFile,
  asyncReadDir,
  asyncRemoveDir,
  asyncRemoveFile
} from "../utils/promisify";
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
        customErrorResponse("Can't fetch products", 404, fetchProductsError);
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
        customErrorResponse(
          `Can't find product with ID: ${productID}`,
          404,
          productFindByIdError
        );
      }
    }
  },
  Mutation: {
    createProduct: async (_, { photoFile, product }) => {
      const rootPath = path.resolve("./public");
      const productPath = path.join(rootPath, "/photos/products");
      try {
        const {
          dataValues: {
            productID,
            productname,
            description,
            pricewithoutdph,
            pricewithdph,
            barcode
          }
        } = await models.Product.create(product);
        const productPhotoDir = path.join(productPath, `${productID}`);
        try {
          const filename = await savePhoto(photoFile, productPhotoDir);
          try {
            await models.ProductPhoto.create({
              productID,
              photo: `/photos/products/${productID}/${filename}`,
              name: `${filename}`
            });
          } catch (productPhotoError) {
            validationErrorResponse(400, productPhotoError);
          }
        } catch (savePhotoError) {
          customErrorResponse(
            "Cant save photo of product",
            400,
            savePhotoError
          );
        }
        return validationSuccessResponse(
          {
            product: {
              productID,
              productname,
              description,
              pricewithoutdph,
              pricewithdph,
              barcode
            }
          },
          200,
          "Product was successfull created"
        );
      } catch (createProductError) {
        console.log("createProductError", createProductError);
        validationErrorResponse(400, createProductError);
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
        let photo = null;
        try {
          const {
            dataValues: { photo: productPhoto }
          } = await models.ProductPhoto.find({
            where: { productID },
            attributes: ["photo"]
          });
          photo = productPhoto;
          if (typeof photoFile === "string") {
            updateProductResponse["product"]["ProductPhoto"] = {
              photo,
              name: path.basename(photoFile)
            };
          } else if (typeof photoFile === "object") {
            const dirPath = path.resolve(
              `./public/photos/products/${productID}`
            );
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
              } catch (updatePhotoError) {
                validationErrorResponse(400, updatePhotoError);
              }
            } catch (saveUpdatedProductPhotoError) {
              customErrorResponse(
                "Cant update product photo",
                _,
                saveUpdatedProductPhotoError
              );
            }
          }
        } catch (productPhotoFindError) {
          customErrorResponse(
            `Cant find photo with id: ${productID}`,
            404,
            productPhotoFindError
          );
        }
      } catch (updateProductError) {
        validationErrorResponse(400, updateProductError);
      }
      return validationSuccessResponse(
        updateProductResponse,
        200,
        "Product was succesfully updated"
      );
    },
    deleteProduct: async (_, { productID }) => {
      const resolvePathToDir = path.resolve(
        `./public/photos/products/${productID}`
      );
      const isExistDir = await asyncAccessFile(resolvePathToDir)
        .then(() => true)
        .catch(() => false);
      if (isExistDir) {
        try {
          await models.Product.destroy({
            where: {
              productID
            }
          });
          try {
            await recursivelyRemoveFiles(resolvePathToDir);
          } catch (recurRemoveFilesError) {
            customErrorResponse(_, _, recurRemoveFilesError);
          }
        } catch (deleteProductError) {
          customErrorResponse(
            `Product with ID ${productID} can't be deleted`,
            400,
            deleteProductError
          );
        }
        const objResponse = { product: { productID } };
        return validationSuccessResponse(
          objResponse,
          200,
          `Product was successfully deleted with ID: ${productID}`
        );
      }
      /* the response should be in if statement
          but we have mocked data where picture just point out to the web url  not to file system where should be saved when
          there are performed operation on customer, product etc

      * */
    }
  }
};

export default ProductResolvers;
