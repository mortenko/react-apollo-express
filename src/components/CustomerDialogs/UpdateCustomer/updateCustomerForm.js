import React from "react";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";
import queryString from "query-string";
import Grid from "@material-ui/core/Grid";
import Loader from "components/Loader";
import Button from "components/Button";
import { DialogActions, DialogTitle } from "components/Dialog";
import BaseCustomerForm from "../baseCustomerForm";
import withCustomerHoc from "../withCustomerHoc";
import styles from "./updateCustomer.scss";
import {
  FETCH_CUSTOMERS,
  FETCH_CUSTOMER,
  UPDATE_CUSTOMER
} from "../../../graphql-client/queries/customer";
import { customerPropTypes, customerDefaultProps } from "../propTypes";
import { toastPropTypes, toastDefaultProps } from "../../../globalProps";

const UpdateCustomerForm = props => {
  const {
    validationFunctions: {
      isRequired,
      hasValidationErrors,
      handleServerErrors
    },
    handleInputChange,
    location: { search },
    closeModal,
    newData,
    toast
  } = props;
  return (
    <Mutation
      mutation={UPDATE_CUSTOMER}
      update={(
        cache,
        {
          data: {
            updateCustomer: { customer }
          }
        }
      ) => {
        const { page } = queryString.parse(search);
        const parsePageInt = parseInt(page, 10);
        const {
          customers: { customers }
        } = cache.readQuery({
          query: FETCH_CUSTOMERS,
          variables: { pageNumber: parsePageInt }
        });
        const updatedCustomersArray = customers.map(customerFromCache => {
          return customerFromCache.customerID === customer.customerID
            ? customer
            : customerFromCache;
        });
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
        if (error) return `${error.message}`;
        return (
          <div className={styles.dialog__container}>
            <Grid container>
              <Grid item xs={12}>
                <DialogTitle className={styles.dialog__title}>
                  Update Customer
                </DialogTitle>
                <BaseCustomerForm
                  customerState={{ ...newData }}
                  handleInputChange={handleInputChange}
                  {...props}
                />
              </Grid>
              <Grid item xs={12}>
                <DialogActions>
                  <Button danger variant="contained" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    disabled={hasValidationErrors()}
                    variant="contained"
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
                      } = props;
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
                          handleServerErrors(error);
                        }
                      }
                    }}
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
};

UpdateCustomerForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  location: PropTypes.objectOf(PropTypes.string),
  newData: customerPropTypes,
  toast: toastPropTypes,
  validationFunctions: PropTypes.objectOf(PropTypes.func)
};

UpdateCustomerForm.defaultProps = {
  location: { search: "" },
  newData: customerDefaultProps,
  validationFunctions: {},
  toast: toastDefaultProps
};

export default withCustomerHoc(UpdateCustomerForm);
