import React from "react";
import { Mutation, Query } from "react-apollo";
import PropTypes from "prop-types";
import queryString from "query-string";
import Typography from "@material-ui/core/Typography";
import {
  DELETE_ORDER,
  FETCH_ORDERS,
  FETCH_ORDERS_BY_ID
} from "../../../graphql-client/queries/order";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "components/Dialog";
import Loader from "components/Loader";
import Button from "components/Button";
import withOrderHoc from "../withOrderHoc";
import FormatOrderResponse from "../formatOrderResponse";
import styles from "./deleteOrder.scss";
import { toastPropTypes, toastDefaultProps } from "../../../globalProps";

const DialogDeleteOrder = ({
  open,
  closeModal,
  classes,
  data: { orderID },
  location: { search },
  toast,
  validationFunctions: { handleServerErrors }
}) => {
  return (
    <Query query={FETCH_ORDERS_BY_ID} variables={{ orderID }}>
      {({ loading, error, data: orderByID }) => {
        if (loading) return null;
        return (
          <Mutation
            mutation={DELETE_ORDER}
            update={cache => {
              const { page } = queryString.parse(search);
              const parsePageInt = parseInt(page, 10);
              const {
                orders: { orders }
              } = cache.readQuery({
                query: FETCH_ORDERS,
                variables: { pageNumber: parsePageInt }
              });
              const deleteOrderFromArray = orders.filter(orderFromCache => {
                if (orderFromCache.orderID !== orderID) {
                  return orderFromCache;
                }
              });
              cache.writeQuery({
                query: FETCH_ORDERS,
                variables: { pageNumber: parsePageInt },
                data: { orders: { orders: deleteOrderFromArray } }
              });
            }}
            variables={{ orderID }}
          >
            {(deleteOrder, { loading, error, data }) => {
              if (loading) return <Loader />;
              if (error) return `${error.message}`;
              const {
                fetchOrdersByID: { order }
              } = orderByID;
              return (
                <Dialog
                  className={styles.dialog}
                  fullWidth={true}
                  maxWidth="md"
                  open={open}
                >
                  <div className={styles.dialog__container}>
                    <DialogTitle className={styles.dialog__title}>
                      Delete Order
                    </DialogTitle>
                    <DialogContent className={styles.dialog__content}>
                      <div className={classes.MuiDialogContentText}>
                        <span className={styles.dialog__content__text}>
                          <Typography variant="h5">
                            Are you sure you want to delete following order:
                          </Typography>
                        </span>
                        <FormatOrderResponse body={order} />
                      </div>
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
                                deleteOrder: {
                                  order: { orderID: orderIDfromDB }
                                }
                              }
                            } = await deleteOrder({
                              variables: {
                                orderID
                              }
                            });
                            closeModal();
                            toast.addToastMessage({
                              content: `Order with orderID: ${orderIDfromDB} was deleted successfully`,
                              type: "success",
                              delay: 2500
                            });
                          } catch (error) {
                            handleServerErrors(error);
                          }
                        }}
                      >
                        Delete Order
                      </Button>
                    </DialogActions>
                  </div>
                </Dialog>
              );
            }}
          </Mutation>
        );
      }}
    </Query>
  );
};

DialogDeleteOrder.propTypes = {
  classes: PropTypes.object.isRequired,
  closeModal: PropTypes.func.isRequired,
  data: PropTypes.shape({
    customerID: PropTypes.number,
    firstname: PropTypes.string,
    lastname: PropTypes.string
  }).isRequired,
  // formatOrderResponse: PropTypes.func.isRequired,
  location: PropTypes.objectOf(PropTypes.string),
  open: PropTypes.bool.isRequired,
  toast: toastPropTypes,
  validationFunctions: PropTypes.objectOf(PropTypes.func)
};

DialogDeleteOrder.defaultProps = {
  location: { search: "" },
  toast: toastDefaultProps,
  validationFunctions: {}
};

export const DELETE_ORDER_MODAL = "DELETE_ORDER_MODAL";
export default withOrderHoc(DialogDeleteOrder);
