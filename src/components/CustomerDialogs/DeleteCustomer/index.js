import React from "react";
import { Mutation } from "react-apollo";
import {
  DELETE_CUSTOMER,
  FETCH_CUSTOMERS,
  FETCH_CUSTOMER
} from "../../../graphql-client/queries/customer/index";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "components/Dialog";
import { enhanceWithHoc } from "../CreateCustomer/index";
import Loader from "components/Loader";
import Button from "components/Button";
import { adopt } from "react-adopt";
import { ToastContext } from "../../../context/index";
import styles from "./dialogDeleteCustomer.scss";
import queryString from "query-string";

const DeleteCustomerFormConsumers = adopt({
  toast: <ToastContext.Consumer />
});

const DialogDeleteCustomer = ({
  open,
  closeModal,
  classes,
  data: { customerID, firstname, lastname },
  location: { search }
}) => {
  return (
    <DeleteCustomerFormConsumers>
      {({ toast }) => (
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
    </DeleteCustomerFormConsumers>
  );
};

export const DELETE_CUSTOMER_MODAL = "DELETE_CUSTOMER_MODAL";
export default enhanceWithHoc(DialogDeleteCustomer);
