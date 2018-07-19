import { wrapStreamWithPromise, collectServerErrors } from "../utils/helper";
import { UserInputError, ApolloError } from "apollo-server";
import fs from "fs";
import path from "path";
import models from "../../../db/models";
import {
  asyncAccessFile,
  asyncCreateDir,
  asyncRemoveFile
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
        const createdCustomer = await models.Customer.create(customer);
        const { customerID } = createdCustomer.dataValues;
        const customerUniqueDir = path.join(customerPath, `${customerID}`);
        try {
          const { filename, stream } = await photoFile;
          if (!fs.existsSync(customerUniqueDir)) {
            try {
              await asyncCreateDir(customerUniqueDir);
              // write file into this dir
              const customerPhotoPath = path.join(customerUniqueDir, filename);
              await wrapStreamWithPromise(customerPhotoPath, stream);
              // save photo url link into DB
            } catch (FileSystemError) {
              throw new ApolloError(FileSystemError, 500);
            }
            try {
              await models.CustomerPhoto.create({
                customerID,
                photo: `/photos/customers/${customerID}/${filename}`,
                name: `${filename}`
              });
            } catch (customerPhotoError) {
              throw new UserInputError(JSON.stringify(customerPhotoError));
            }
          }
        } catch (photoFileError) {
          throw new ApolloError(photoFileError, 400);
        }
      } catch (createCustomerError) {
        const serverErrors = collectServerErrors(createCustomerError);
        throw new UserInputError(JSON.stringify(serverErrors));
      }
    },
    updateCustomer: async (
      _,
      { photoFile, customer: { customerID, firstname, lastname, email, phone } }
    ) => {
      const updateCustomerResponse = {};
      const updateCustomer = {
        firstname,
        lastname,
        email,
        phone
      };
      try {
        const response = await models.Customer.update(updateCustomer, {
          where: {
            customerID
          },
          returning: true,
          individualHooks: true
        });
        // RESPONSE FROM UPDATE
        const {
          createdAt,
          updatedAt,
          ...updatedCustomer
        } = response[1][0].dataValues;
        updateCustomerResponse["customer"] = { customerID, ...updateCustomer };
      } catch (updateCustomerError) {
        const serverErrors = collectServerErrors(updateCustomerError);
        throw new UserInputError(JSON.stringify(serverErrors));
      }
      try {
        let photo = null;
        try {
          const {
            dataValues: { photo: customerPhoto }
          } = await models.CustomerPhoto.findById(customerID, {
            attributes: ["photo"]
          });
          photo = customerPhoto;
        } catch (queryFindPhotoError) {
          return ApolloError(queryFindPhotoError, 500);
        }
        if (typeof photoFile === "string") {
          updateCustomerResponse["customer"]["CustomerPhoto"] = {
            photo
          };
        } else if (typeof photoFile === "object") {
          const { filename, stream } = await photoFile;
          const pathToFile = path.resolve(
            `./public/photos/customers/${customerID}/${filename}`
          );
          // check if file exists (if exists do nothing because customer's photo stays previous)
          const isExistFile = await asyncAccessFile(
            pathToFile,
            fs.constants.F_OK
          )
            .then(() => false)
            .catch(() => true);
          // if customer doesnt change photo you have to send relative link to photo anyway
          if (isExistFile) {
            // get relative path of previous photo file (it needs to be know cause of removing it) from DB
            try {
              // remove previous photo file
              const absolutePathToPhoto = path.resolve(`./public/${photo}`);
              await asyncRemoveFile(absolutePathToPhoto);
              // write new photo
              await wrapStreamWithPromise(pathToFile, stream);
            } catch (removeUploadPhotoError) {
              return new ApolloError(
                JSON.stringify(removeUploadPhotoError),
                500
              );
            }
          }
          try {
            const response = await models.CustomerPhoto.update(
              { photo: `photos/customers/${customerID}/${filename}` },
              {
                returning: true,
                where: {
                  customerPhotoID: customerID
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
        }
      } catch (uploadFileError) {
        throw new ApolloError(uploadFileError, 500);
      }
      return updateCustomerResponse;
    },
    deleteCustomer: async (_, { customerID }) => {
      const resolvePathToFile = path.resolve(
        `./public/photos/customers/${customerID}`
      );
      const isExistFile = await asyncAccessFile(resolvePathToFile)
        .then(() => true)
        .catch(() => false);
      if (isExistFile) {
        try {
          await asyncRemoveFile(resolvePathToFile);
        } catch (removeFileError) {
          throw new ApolloError(removeFileError, 500);
        }
      }
    }
  }
};

export default CustomerResolvers;
