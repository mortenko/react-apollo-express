import React from "react";
import { Mutation } from "react-apollo";
import { compose, withProps } from "recompose";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
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
import styles from "./createCustomer.scss";
import Loader from "components/Loader";
import withValidator from "../../../utils/validation";
import { CREATE_CUSTOMER } from "../../../graphql-client/queries/customer";
import BaseCustomerForm from "../baseCustomerForm";
import withCustomerForm from "../withCustomerForm";
import { enhanceWithBaseHoc } from "../../Dialog/dialogHoc";

const initialErrorValues = {
  firstname: [],
  lastname: [],
  email: [],
  phone: [],
  photo: {}
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
export const enhanceWithCustomerHoc = compose(
  withProps(() => ({ initialErrorValues }), withValidator),
  withProps(() => ({ initialFormValues }), withCustomerForm),
  enhanceWithBaseHoc,
  withCustomerForm
);
const DialogCreateCustomer = props => {
  const {
    open,
    closeModal,
    resetForm,
    validationFunctions: {
      isRequired,
      hasValidationErrors,
      handleServerErrors
    },
    newData,
    handleInputChange
  } = props;
  return (
    <Dialog
      maxWidth="md"
      fullWidth={true}
      open={open}
      className={styles.dialog}
    >
      <ToastContext.Consumer>
        {toast => (
          <Mutation
            mutation={CREATE_CUSTOMER}
            errorPolicy="all"
          >
            {(createCustomer, { loading, error, data }) => {
              if (loading) return <Loader />;
              return (
                <div className={styles.dialog__container}>
                  <Grid container>
                    <Grid item xs={12}>
                      <DialogTitle className={styles.dialog__title}>
                        Create Customer
                      </DialogTitle>
                    </Grid>
                    <Grid item xs={12}>
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
                          onClick={() => {
                            closeModal();
                            resetForm();
                          }}
                        >
                          Cancel
                        </Button>

                        <Button
                          variant="contained"
                          color="success"
                          disabled={hasValidationErrors()}
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
                                const {
                                  data: {
                                    createCustomer: {
                                      mutationResponse: { message }
                                    }
                                  }
                                } = await createCustomer({
                                  variables: {
                                    photoFile: photo,
                                    customer
                                  }
                                });
                                closeModal();
                                resetForm();
                                toast.addToastMessage({
                                  content: message,
                                  type: "success",
                                  delay: 2500
                                });
                              } catch (customerError) {
                                handleServerErrors(customerError)
                              }
                            }
                          }}
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
DialogCreateCustomer.propTypes = {
  closeModal: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  newData: PropTypes.shape({
    customerID: PropTypes.number,
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    CustomerPhoto: PropTypes.shape({
      photo: PropTypes.object,
      name: PropTypes.string
    })
  }).isRequired,
  open: PropTypes.bool.isRequired,
  resetForm: PropTypes.func.isRequired,
  validationFunctions: PropTypes.objectOf(PropTypes.func)
};
DialogCreateCustomer.defaultProps = {
  validationFunctions: {}
};

export const CREATE_CUSTOMER_MODAL = "CREATE_CUSTOMER_MODAL";

export default enhanceWithCustomerHoc(DialogCreateCustomer);
