import path from "path";
import models from "../../../db/models";
import { recursivelyRemoveFiles, savePhoto } from "../utils/helper";
import { errorResponse, successResponse } from "../utils/response_handler";
import { asyncAccessFile } from "../utils/promisify";

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
        return errorResponse(
          "Can't fetch products from DB",
          500,
          fetchProductsError
        );
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
        return errorResponse(
          `Can't find product with ID: ${productID}`,
          404,
          productFindByIdError
        );
      }
    },

    productFilter: async (_, { filterBy: productname }) => {
      try {
        const response = await models.Product.findAll({
          attributes: [
            ["productID", "id"],
            ["productname", "value"],
            "pricewithoutdph",
            "pricewithdph"
          ],
          orderBy: ["productname"],
          where: {
            productname: {
              [models.Sequelize.Op.iRegexp]: `^${productname}`
            }
          }
        });
        return response.map(({ dataValues: filter }) => {
          return filter;
        });
      } catch (productFilterError) {
        return errorResponse("Can't filter products", 500, productFilterError);
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
        const productPhotoDirPath = path.join(productPath, `${productID}`);
        try {
          const filename = await savePhoto(photoFile, productPhotoDirPath);
          try {
            await models.ProductPhoto.create({
              productID,
              photo: `/photos/products/${productID}/${filename}`,
              name: `${filename}`
            });
          } catch (productPhotoDBerror) {
            return errorResponse(
              "Can't insert new product photo in DB",
              500,
              productPhotoDBerror
            );
          }
        } catch (savePhotoFSerror) {
          return errorResponse(
            "Cant save photo of product into FS",
            500,
            savePhotoFSerror
          );
        }
        return successResponse(
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
      } catch (createProductDBerror) {
        return errorResponse(
          "Can insert new product into DB",
          500,
          createProductDBerror
        );
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
              } catch (updatePhotoDBerror) {
                return errorResponse(
                  "Can't update product photo in DB",
                  500,
                  updatePhotoDBerror
                );
              }
            } catch (updatedPhotoFSerror) {
              return errorResponse(
                "Cant update product photo in FS",
                500,
                updatedPhotoFSerror
              );
            }
          }
        } catch (productPhotoFindError) {
          return errorResponse(
            `Cant find photo with id: ${productID}`,
            404,
            productPhotoFindError
          );
        }
      } catch (updateProductError) {
        return errorResponse("Can't update product", 500, updateProductError);
      }
      return successResponse(
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
            return errorResponse(
              "Can't recursively remove product's photo from FS",
              500,
              recurRemoveFilesError
            );
          }
        } catch (deleteProductError) {
          return errorResponse(
            `Product with ID ${productID} can't be deleted`,
            500,
            deleteProductError
          );
        }
        const objResponse = { product: { productID } };
        /* the response should be in if statement
            but we have mocked data where picture just point out to the web url  not to file system where should be saved when
            there are performed operation on customer, product etc
        */
        return successResponse(
          objResponse,
          200,
          `Product was successfully deleted with ID: ${productID}`
        );
      }
    }
  }
};

export default ProductResolvers;
