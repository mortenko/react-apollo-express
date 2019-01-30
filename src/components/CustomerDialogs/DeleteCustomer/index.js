import React from "react";
import { Mutation } from "react-apollo";
import PropTypes from "prop-types";
import queryString from "query-string";
import {
  DELETE_CUSTOMER,
  FETCH_CUSTOMERS
} from "../../../graphql-client/queries/customer";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "components/Dialog";
import Loader from "components/Loader";
import Button from "components/Button";
import withCustomerHoc from "../withCustomerHoc";
import styles from "./deleteCustomer.scss";
import { toastPropTypes, toastDefaultProps } from "../../../globalProps";

const DialogDeleteCustomer = ({
  open,
  closeModal,
  classes,
  validationFunctions: { handleServerErrors },
  data: { customerID, firstname, lastname },
  location: { search },
  toast
}) => {
  return (
    <Mutation
      mutation={DELETE_CUSTOMER}
      update={cache => {
        const { page } = queryString.parse(search);
        const parsePageInt = parseInt(page, 10);
        const {
          customers: { customers }
        } = cache.readQuery({
          query: FETCH_CUSTOMERS,
          variables: { pageNumber: parsePageInt }
        });
        const deleteCustomerFromArray = customers.filter(customerFromCache => {
          if (customerFromCache.customerID !== customerID) {
            return customerFromCache;
          }
        });
        cache.writeQuery({
          query: FETCH_CUSTOMERS,
          variables: { pageNumber: parsePageInt },
          data: { customers: { customers: deleteCustomerFromArray } }
        });
      }}
      variables={{ customerID }}
    >
      {(deleteCustomer, { loading, error, data }) => {
        if (loading) return <Loader />;
        if (error) return `${error.message}`;
        return (
          <Dialog
            className={styles.dialog}
            fullWidth={true}
            maxWidth="md"
            open={open}
          >
            <div className={styles.dialog__container}>
              <DialogTitle className={styles.dialog__title}>
                Delete Customer
              </DialogTitle>
              <DialogContent className={styles.dialog__content}>
                <DialogContentText className={classes.MuiDialogContentText}>
                  <span className={styles.dialog__content__text}>
                    Are you sure you want to delete customer:
                    <span>
                      {firstname} {lastname}
                    </span>
                  </span>
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button danger variant="contained" onClick={closeModal}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={async () => {
                    try {
                      const {
                        data: {
                          deleteCustomer: {
                            customer: { customerID: ID }
                          }
                        }
                      } = await deleteCustomer({
                        variables: {
                          customerID
                        }
                      });
                      closeModal();
                      toast.addToastMessage({
                        content: `Customer ${firstname} ${lastname} with ID: ${ID} was deleted successfully`,
                        type: "success",
                        delay: 2500
                      });
                    } catch (error) {
                      handleServerErrors(error);
                    }
                  }}
                >
                  Delete Customer
                </Button>
              </DialogActions>
            </div>
          </Dialog>
        );
      }}
    </Mutation>
  );
};

DialogDeleteCustomer.propTypes = {
  classes: PropTypes.object.isRequired,
  closeModal: PropTypes.func.isRequired,
  data: PropTypes.shape({
    customerID: PropTypes.number,
    firstname: PropTypes.string,
    lastname: PropTypes.string
  }).isRequired,
  location: PropTypes.objectOf(PropTypes.string),
  open: PropTypes.bool.isRequired,
  toast: toastPropTypes,
  validationFunctions: PropTypes.objectOf(PropTypes.func)
};

DialogDeleteCustomer.defaultProps = {
  location: { search: "" },
  toast: toastDefaultProps,
  validationFunctions: {}
};

export const DELETE_CUSTOMER_MODAL = "DELETE_CUSTOMER_MODAL";
export default withCustomerHoc(DialogDeleteCustomer);
