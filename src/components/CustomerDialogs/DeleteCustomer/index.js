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
import { ToastConsumer } from "../../Dialog/dialogHoc";
import styles from "./deleteCustomer.scss";

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
      variables={{ customerID }}
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
    >
      {(deleteCustomer, { loading, error, data }) => {
        if (loading) return <Loader />;
        if (error) return `${error.message}`;
        return (
          <Dialog
            maxWidth="md"
            open={open}
            fullWidth={true}
            className={styles.dialog}
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
                <Button variant="contained" color="info" onClick={closeModal}>
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    try {
                      const {
                        data: {
                          deleteCustomer: {
                            customer: { customerID }
                          }
                        }
                      } = await deleteCustomer({
                        variables: {
                          customerID
                        }
                      });
                      closeModal();
                      toast.addToastMessage({
                        content: `Customer ${firstname} ${lastname} with ID: ${customerID} was deleted successfully`,
                        type: "success",
                        delay: 2500
                      });
                    } catch (error) {
                      handleServerErrors(error);
                    }
                  }}
                  variant="contained"
                  color="danger"
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
  location: PropTypes.objectOf(PropTypes.object),
  open: PropTypes.bool.isRequired,
  toast: PropTypes.shape({
    addToastMessage: PropTypes.func.isRequired,
    removeToastMessage: PropTypes.func.isRequired,
    toasts: PropTypes.array
  }),
  validationFunctions: PropTypes.objectOf(PropTypes.func)
};

DialogDeleteCustomer.defaultProps = {
  location: { search: "" },
  toast: {
    toasts: []
  },
  validationFunctions: {}
};

export const DELETE_CUSTOMER_MODAL = "DELETE_CUSTOMER_MODAL";
export default withCustomerHoc(DialogDeleteCustomer);
