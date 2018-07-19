import React, { Component } from "react";
import Button from "components/Button";
import { Mutation } from "react-apollo";
import { ToastContext } from "../../../context/index";
import Loader from "components/Loader";
import Grid from "@material-ui/core/Grid";
import queryString from "query-string";
import BaseCustomerForm from "../baseCustomerForm";
import { adopt } from "react-adopt";
import { enhanceWithHoc } from "../CreateCustomer/index";
import {
  InputAdornment,
  TextField,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogStyles
} from "components/Dialog";
import styles from "./dialogUpdateCustomer.scss";
import {
  FETCH_CUSTOMERS,
  FETCH_CUSTOMER,
  UPDATE_CUSTOMER
} from "../../../graphql-client/queries/customer/index";

const UpdateCustomerFormConsumers = adopt({
  toast: <ToastContext.Consumer />
});

const UpdateCustomerForm = props => {
  const {
    validationFunctions: { isRequired, hasValidationErrors },
    handleInputChange,
    location: { search },
    closeModal,
    newData
  } = props;

  return (
    <UpdateCustomerFormConsumers>
      {({ toast }) => {
        return (
          <Mutation
            mutation={UPDATE_CUSTOMER}
            update={(cache, { data: { updateCustomer: { customer } } }) => {
              const { page } = queryString.parse(search);
              const parsePageInt = parseInt(page, 10);
              const { customers: { customers } } = cache.readQuery({
                query: FETCH_CUSTOMERS,
                variables: { pageNumber: parsePageInt }
              });
              const updatedCustomersArray = customers.map(customerFromCache => {
                return customerFromCache.customerID === customer.customerID
                  ? customer
                  : customerFromCache;
              });
              // update customer in cache
              cache.writeQuery({
                query: FETCH_CUSTOMERS,
                variables: { pageNumber: parsePageInt },
                data: { customers: { customers: updatedCustomersArray } }
              });
              // update customer's values when clicked on update customer modal
              cache.writeQuery({
                query: FETCH_CUSTOMER,
                variables: {
                  customerID: customer.customerID
                },
                data: { customer }
              });
            }}
          >
            {(updateCustomer, { loading, error, data }) => {
              if (loading) return <Loader />;
              if (error) return <span>{error.message}</span>;
              return (
                <div className={styles.dialog__container}>
                  <Grid container>
                    <Grid item xs={12}>
                      <DialogTitle className={styles.dialog__title}>
                        Update Customer
                      </DialogTitle>
                      <BaseCustomerForm
                        handleInputChange={handleInputChange}
                        customerState={{ ...newData }}
                        {...props}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <DialogActions>
                        <Button
                          variant="contained"
                          color="info"
                          onClick={closeModal}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={async () => {
                            const {
                              newData: {
                                customer: updateCustomerObj,
                                ///destruct CustomerPhoto from object customer
                                customer: {
                                  CustomerPhoto: { photo },
                                  ...customer
                                }
                              }
                            } = this.props;
                            // test whole customer
                            if (isRequired(updateCustomerObj) === false) {
                              try {
                                await updateCustomer({
                                  variables: {
                                    photoFile: photo,
                                    customer
                                  }
                                });
                                closeModal();
                                toast.addToastMessage({
                                  content: `Customer ${customer.firstname} ${
                                    customer.lastname
                                  } was updated successfully`,
                                  type: "success",
                                  delay: 2500
                                });
                              } catch (error) {
                                console.log("error", error);
                                // handleServerErrors(error);
                              }
                            }
                          }}
                          variant="contained"
                          color="primary"
                          disabled={hasValidationErrors()}
                        >
                          Update Customer
                        </Button>
                      </DialogActions>
                    </Grid>
                  </Grid>
                </div>
              );
            }}
          </Mutation>
        );
      }}
    </UpdateCustomerFormConsumers>
  );
};
export default enhanceWithHoc(UpdateCustomerForm);