import React, { Component } from "react";
import { Mutation } from "react-apollo";
import { compose, withProps } from "recompose";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import { ToastContext } from "../../../context/index";
import Button from "components/Button";
import {
  Dialog,
  DialogStyles,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  TextField
} from "components/Dialog";
import styles from "./dialogCreateCustomer.scss";
import Loader from "components/Loader";
import withValidator from "../../../utils/validation";
import { CREATE_CUSTOMER } from "../../../graphql-client/queries/customer/index";
import BaseCustomerForm from "../baseCustomerForm";
import withCustomerForm from "../customerFormHoc";

const initialErrorValues = {
  firstname: "",
  lastname: "",
  email: "",
  phone: "",
  photo: ""
};
const initialFormValues = {
  customer: {
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    CustomerPhoto: {
      photo: null,
      name: ""
    }
  }
};

export const enhanceWithHoc = compose(
  withStyles(DialogStyles),
  withProps(() => ({ initialErrorValues }), withValidator),
  withProps(() => ({ initialFormValues }), withCustomerForm),
  withCustomerForm,
  withValidator,
  withRouter
);
const DialogCreateCustomer = props => {
  const {
    open,
    closeModal,
    validationFunctions: {
      isRequired,
      hasValidationErrors,
      handleServerErrors
    },
    newData,
    handleInputChange
  } = props;
  // in mutation I need to send photoFile and customer separately
  //  const { customer: { photoFile, ...customer } } = this.state;
  return (
    <Dialog
      maxWidth="md"
      fullWidth={true}
      open={open}
      {...props}
      className={styles.dialog}
    >
      <ToastContext.Consumer>
        {toast => (
          <Mutation mutation={CREATE_CUSTOMER}>
            {(createCustomer, { loading, error, data }) => {
              if (loading) return <Loader />;
              if (error) return `${error.message}`;
              return (
                <div className={styles.dialog__container}>
                  <Grid container>
                    <Grid item xs={12}>
                      <DialogTitle className={styles.dialog__title}>
                        Create Customer
                      </DialogTitle>
                      <BaseCustomerForm
                        customerState={{ ...newData }}
                        handleInputChange={handleInputChange}
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
                              ///destruct CustomerPhoto from object customer
                              customer: {
                                CustomerPhoto: { photo },
                                ...customer
                              }
                            } = newData;
                            if (isRequired({ ...customer, photo }) === false) {
                              try {
                                await createCustomer({
                                  variables: {
                                    photoFile: photo,
                                    customer
                                  }
                                });
                                closeModal();
                                toast.addToastMessage({
                                  content: `Customer ${customer.firstname} ${
                                    customer.lastname
                                  } was created successfully`,
                                  type: "success",
                                  delay: 2500
                                });
                              } catch (error) {
                                handleServerErrors(error);
                              }
                            }
                          }}
                          variant="contained"
                          color="success"
                          disabled={hasValidationErrors()}
                        >
                          Create Customer
                        </Button>
                      </DialogActions>
                    </Grid>
                  </Grid>
                </div>
              );
            }}
          </Mutation>
        )}
      </ToastContext.Consumer>
    </Dialog>
  );
};

export const CREATE_CUSTOMER_MODAL = "CREATE_CUSTOMER_MODAL";

export default enhanceWithHoc(DialogCreateCustomer);
