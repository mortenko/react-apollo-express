import { collectServerErrors, savePhoto } from "../utils/helper";
import { UserInputError, ApolloError } from "apollo-server";
import fs from "fs";
import path from "path";
import models from "../../../db/models";
import {
  asyncAccessFile,
  asyncCreateDir,
  asyncRemoveFile,
  asyncRemoveDir,
  asyncReadDir
} from "../utils/promisify";

const CustomerResolvers = {
  Query: {
    customers: async (_, { cursor, pageNumber }) => {
      const offset = (pageNumber - 1) * cursor;
      try {
        const {
          rows: customers,
          count
        } = await models.Customer.findAndCountAll({
          order: ["customerID"],
          include: {
            model: models.CustomerPhoto,
            attributes: ["customerPhotoID", "photo"],
            required: true
          },
          offset,
          limit: 12,
          attributes: ["customerID", "firstname", "lastname", "phone", "email"]
        });
        return { customers, count };
      } catch (fetchCustomerError) {
        throw new ApolloError(fetchCustomerError, 500);
      }
    },
    customer: async (_, { customerID }) => {
      try {
        return await models.Customer.findById(customerID, {
          include: {
            model: models.CustomerPhoto,
            attributes: ["photo", "name"]
          },
          attributes: ["customerID", "firstname", "lastname", "phone", "email"]
        });
      } catch (customerFindByIdError) {
        throw new ApolloError(JSON.stringify(customerFindByIdError), 400);
      }
    }
  },
  Mutation: {
    createCustomer: async (_, { photoFile, customer }) => {
      const rootPath = path.resolve("./public");
      const customerPath = path.join(rootPath, "/photos/customers");
      try {
        const { dataValues: { customerID } } = await models.Customer.create(
          customer
        );
        const customerUniqueDir = path.join(customerPath, `${customerID}`);
        try {
          const filename = await savePhoto(photoFile, customerUniqueDir);
          try {
            await models.CustomerPhoto.create({
              customerID,
              photo: `/photos/customers/${customerID}/${filename}`,
              name: filename
            });
          } catch (customerPhotoError) {
            throw new UserInputError(JSON.stringify(customerPhotoError));
          }
        } catch (photoFileError) {
          throw new ApolloError(photoFileError, 400);
        }
      } catch (createCustomerError) {
        console.log("createCustomerError", createCustomerError);
        // const serverErrors = collectServerErrors(createCustomerError);
        // throw new UserInputError(JSON.stringify(serverErrors));
      }
    },
    updateCustomer: async (
      _,
      { photoFile, customer: { customerID, ...customer } }
    ) => {
      const updateCustomerResponse = {};
      try {
        const customerObj = await models.Customer.update(customer, {
          where: {
            customerID
          },
          returning: true,
          individualHooks: true
        });
        const {
          createdAt,
          updatedAt,
          ...updatedCustomer
        } = customerObj[1][0].dataValues;
        updateCustomerResponse["customer"] = { customerID, ...updatedCustomer };
      } catch (updateCustomerError) {
        const serverErrors = collectServerErrors(updateCustomerError);
        throw new UserInputError(JSON.stringify(serverErrors));
      }
      let photo = null;
      try {
        const {
          dataValues: { photo: customerPhoto }
        } = await models.CustomerPhoto.find({
          where: { customerID },
          attributes: ["photo"]
        });
        photo = customerPhoto;
      } catch (queryFindPhotoError) {
        throw new ApolloError(queryFindPhotoError, 500);
      }
      if (typeof photoFile === "string") {
        updateCustomerResponse["customer"]["CustomerPhoto"] = {
          photo
        };
      } else if (typeof photoFile === "object") {
        const dirPath = path.resolve(`./public/photos/customers/${customerID}`);
        try {
          const filename = await savePhoto(photoFile, dirPath, photo);
          try {
            const response = await models.CustomerPhoto.update(
              { photo: `photos/customers/${customerID}/${filename}` },
              {
                returning: true,
                where: {
                  customerID
                }
              }
            );
            const { photo } = response[1][0].dataValues;
            updateCustomerResponse["customer"]["CustomerPhoto"] = {
              photo
            };
          } catch (customerPhotoUpdateError) {
            throw new ApolloError(customerPhotoUpdateError, 500);
          }
        } catch (savePhotoError) {
          throw new ApolloError(savePhotoError, 500);
        }
      }
      return updateCustomerResponse;
    },
    deleteCustomer: async (_, { customerID }) => {
      const resolvePathToDir = path.resolve(
        `./public/photos/customers/${customerID}`
      );
      const isExistDir = await asyncAccessFile(resolvePathToDir)
        .then(() => true)
        .catch(() => false);
      if (isExistDir) {
        try {
          const files = await asyncReadDir(resolvePathToDir);
          for (let file = 0; file < files.length; file++) {
            try {
              const resolvePathToFile = path.join(
                resolvePathToDir,
                files[file]
              );
              await asyncRemoveFile(resolvePathToFile);
            } catch (fileRemoveError) {
              throw new ApolloError(fileRemoveError, 500);
            }
          }
          await asyncRemoveDir(resolvePathToDir);
        } catch (dirError) {
          throw new ApolloError(dirError, 500);
        }
      }
      try {
        await models.Customer.destroy({
          where: {
            customerID
          }
        });
      } catch (deleteCustomerError) {
        throw new ApolloError(deleteCustomerError, 400);
      }
    }
  }
};

export default CustomerResolvers;

