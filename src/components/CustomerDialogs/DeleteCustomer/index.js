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
import { enhanceWithHoc } from "../CreateCustomer";
import { ToastContext } from "../../../context";
import styles from "./dialogDeleteCustomer.scss";

const DialogDeleteCustomer = ({
  open,
  closeModal,
  classes,
  data: { customerID, firstname, lastname },
  location: { search }
}) => {
  return (
    <ToastContext.Consumer>
      {toast => (
        <Mutation
          mutation={DELETE_CUSTOMER}
          variables={{ customerID }}
          update={cache => {
            const { page } = queryString.parse(search);
            const parsePageInt = parseInt(page, 10);
            const { customers: { customers } } = cache.readQuery({
              query: FETCH_CUSTOMERS,
              variables: { pageNumber: parsePageInt }
            });
            const deleteCustomerFromArray = customers.filter(
              customerFromCache => {
                if (customerFromCache.customerID !== customerID) {
                  return customerFromCache;
                }
              }
            );
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
                    <Button
                      variant="contained"
                      color="info"
                      onClick={closeModal}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={async () => {
                        try {
                          await deleteCustomer({
                            variables: {
                              customerID
                            }
                          });
                          closeModal();
                          toast.addToastMessage({
                            content: `Customer ${firstname} ${lastname} was deleted successfully`,
                            type: "success",
                            delay: 2500
                          });
                        } catch (error) {
                          console.log("error", error);
                          // handleServerErrors(error);
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
      )}
    </ToastContext.Consumer>
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
  open: PropTypes.bool.isRequired
};

DialogDeleteCustomer.defaultProps = {
  location: { search: "" }
};

export const DELETE_CUSTOMER_MODAL = "DELETE_CUSTOMER_MODAL";
export default enhanceWithHoc(DialogDeleteCustomer);
