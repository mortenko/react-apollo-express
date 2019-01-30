import path from "path";
import { size, assign } from "lodash";
import { recursivelyRemoveFiles, savePhoto } from "../utils/helper";
import { errorResponse, successResponse } from "../utils/response_handler";
import models from "../../../db/models";
import { asyncAccessFile } from "../utils/promisify";

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
        return errorResponse("Customers not founded", 404, fetchCustomerError);
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
        return errorResponse(
          `Customer with ${customerID} was not found`,
          404,
          customerFindByIdError
        );
      }
    },
    customerFilter: async (_, { filterBy, advancedFilterBy }) => {
      const getKey = Object.keys(filterBy)[0];
      const getValue = Object.values(filterBy)[0];
      let composeWhereClause = {};
      if (size(advancedFilterBy) < 1) {
        composeWhereClause = {
          [getKey]: {
            [models.Sequelize.Op.iRegexp]: `^${getValue}`
          }
        };
      } else {
        assign(composeWhereClause, advancedFilterBy);
      }
      try {
        const response = await models.Customer.findAll({
          attributes: [
            [
              models.Sequelize.fn(
                "DISTINCT",
                models.Sequelize.col(`${getKey}`)
              ),
              "value"
            ],
            ["customerID", "id"]
          ],
          order: [`${getKey}`],
          where: {
            ...composeWhereClause
          }
        });
        return response.map(({ dataValues: filter }) => {
          return filter;
        });
      } catch (customerFilterError) {
        return errorResponse(
          "Can't find any customer followed by given criterion",
          404,
          customerFilterError
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
            return successResponse(
              objResponse,
              200,
              `Customer ${firstname} ${lastname} was created successfully`
            );
          } catch (customerPhotoDBerror) {
            return errorResponse(
              "Unable to inserto customerPhoto into DB",
              400,
              customerPhotoDBerror
            );
          }
        } catch (photoFileFSerror) {
          return errorResponse(
            "Cant't save photo of Customer into FS",
            500,
            photoFileFSerror
          );
        }
      } catch (createCustomerDBerror) {
        return errorResponse(
          "Can't create new Customer",
          _,
          createCustomerDBerror
        );
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
              } catch (photoUpdateDBerror) {
                return errorResponse(
                  "Photo was not updated in DB",
                  500,
                  photoUpdateDBerror
                );
              }
            } catch (savePhotoFSerror) {
              return errorResponse(
                "Can't save updated customer photo into FS",
                500,
                savePhotoFSerror
              );
            }
          }
        } catch (findCustomerPhotoError) {
          return errorResponse(
            `Cant't find customer with ${customerID}`,
            404,
            findCustomerPhotoError
          );
        }
        return successResponse(
          updateCustomerResponse,
          200,
          "Customer was updated successfully"
        );
      } catch (updateCustomerDBerror) {
        return errorResponse(
          "Can't update Customer in DB",
          400,
          updateCustomerDBerror
        );
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
            return errorResponse(
              "Customer files can't be removed recursively from FS",
              500,
              recurRemoveFilesError
            );
          }
        } catch (deleteCustomerDBerror) {
          return errorResponse(
            `Customer with ID ${customerID} can't be deleted from DB`,
            400,
            deleteCustomerDBerror
          );
        }
      }
      const objResponse = { customer: { customerID } };
      return successResponse(
        objResponse,
        200,
        `Customer was successfully deleted with ID: ${customerID}`
      );
    }
  }
};

export default CustomerResolvers;
