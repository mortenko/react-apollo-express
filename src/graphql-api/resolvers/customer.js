import { recursivelyRemoveFiles, savePhoto } from "../utils/helper";
import {
  validationErrorResponse,
  validationSuccessResponse,
  customErrorResponse
} from "../utils/error_handler";
import path from "path";
import models from "../../../db/models";
import {
  asyncAccessFile,
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
        customErrorResponse("Customers not founded", 404, fetchCustomerError);
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
        customErrorResponse(
          `Customer with ${customerID} was not found`,
          404,
          customerFindByIdError
        );
      }
    }
  },
  Mutation: {
    createCustomer: async (_, { photoFile, customer }) => {
      const rootPath = path.resolve("./public");
      const customerPath = path.join(rootPath, "/photos/customers");
      try {
        const {
          dataValues: { customerID, firstname, lastname, email, phone }
        } = await models.Customer.create(customer);
        const customerUniqueDir = path.join(customerPath, `${customerID}`);
        try {
          const filename = await savePhoto(photoFile, customerUniqueDir);
          try {
            await models.CustomerPhoto.create({
              customerID,
              photo: `/photos/customers/${customerID}/${filename}`,
              name: filename
            });
            const objResponse = {
              // key of object must be the same as the graphql name query
              customer: { firstname, lastname, email, phone }
            };
            return validationSuccessResponse(
              objResponse,
              200,
              `Customer ${firstname} ${lastname} was created successfully`
            );
          } catch (customerPhotoError) {
            validationErrorResponse(400, customerPhotoError);
          }
        } catch (photoFileError) {
          customErrorResponse("Cant't save photo of User", _, photoFileError);
        }
      } catch (createCustomerError) {
        validationErrorResponse(400, createCustomerError);
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
        let photo = null;
        try {
          const {
            dataValues: { photo: customerPhoto }
          } = await models.CustomerPhoto.find({
            where: { customerID },
            attributes: ["photo"]
          });
          photo = customerPhoto;
          if (typeof photoFile === "string") {
            updateCustomerResponse["customer"]["CustomerPhoto"] = {
              photo,
              name: path.basename(photoFile)
            };
          } else if (typeof photoFile === "object") {
            const dirPath = path.resolve(
              `./public/photos/customers/${customerID}`
            );
            try {
              const filename = await savePhoto(photoFile, dirPath, photo);
              try {
                const response = await models.CustomerPhoto.update(
                  {
                    photo: `photos/customers/${customerID}/${filename}`,
                    name: filename
                  },
                  {
                    returning: true,
                    where: {
                      customerID
                    }
                  }
                );
                const { photo } = response[1][0].dataValues;
                updateCustomerResponse["customer"]["CustomerPhoto"] = {
                  photo,
                  name: filename
                };
              } catch (customerPhotoUpdateError) {
                validationErrorResponse(400, customerPhotoUpdateError);
              }
            } catch (savePhotoError) {
              customErrorResponse(
                "Can't save new photo from updateCustomer",
                "400",
                savePhotoError
              );
            }
          }
        } catch (queryFindPhotoError) {
          customErrorResponse(
            `Cant't find customer with ${customerID}`,
            404,
            queryFindPhotoError
          );
        }
        return validationSuccessResponse(
          updateCustomerResponse,
          200,
          "Customer was updated successfully"
        );
      } catch (updateCustomerError) {
        validationErrorResponse(400, updateCustomerError);
      }
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
          await models.Customer.destroy({
            where: {
              customerID
            }
          });
          try {
            await recursivelyRemoveFiles(resolvePathToDir);
          } catch (recurRemoveFilesError) {
            customErrorResponse(_, _, recurRemoveFilesError);
          }
        } catch (deleteCustomerError) {
          customErrorResponse(
            `User with ID ${customerID} can't be deleted`,
            400,
            deleteCustomerError
          );
        }
      }
      const objResponse = { customer: { customerID } };
      return validationSuccessResponse(
        objResponse,
        200,
        `Customer was successfully deleted with ID: ${customerID}`
      );
    }
  }
};

export default CustomerResolvers;
