import React from "react";
import { Mutation } from "react-apollo";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Button from "components/Button";
import { Dialog, DialogTitle, DialogActions } from "components/Dialog";
import withOrderHoc from "../withOrderHoc";
import styles from "./createorder.scss";
import BaseOrderForm from "../baseOrderForm";
import {
  CREATE_ORDER,
  FETCH_ORDERS
} from "../../../graphql-client/queries/order";
import { toastDefaultProps, toastPropTypes } from "../../../globalProps";
import FormatOrderResponse from "../formatOrderResponse";

const DialogCreateOrder = ({
  open,
  closeModal,
  data: { pageNumber, itemsCountPerPage },
  newData,
  extractProductName,
  resetForm,
  title,
  toast,
  validationFunctions: { isRequired, hasValidationErrors, handleServerErrors },
  ...props
}) => {
  return (
    <Dialog maxWidth="md" open={open} className={styles.dialog}>
      <Mutation
        mutation={CREATE_ORDER}
        refetchQueries={[
          {
            query: FETCH_ORDERS,
            variables: { pageNumber, cursor: itemsCountPerPage }
          }
        ]}
      >
        {(createOrder, { loading, error }) => (
          <div className={styles.dialog__container}>
            <Grid container>
              <Grid item xs={12}>
                <DialogTitle className={styles.dialog__title}>
                  {title}
                </DialogTitle>
              </Grid>
              <Grid item xs={12}>
                <BaseOrderForm orderState={{ ...newData }} {...props} />
              </Grid>
              <Grid item xs={12}>
                <DialogActions>
                  <Button
                    danger
                    variant="contained"
                    onClick={() => {
                      closeModal();
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    disabled={hasValidationErrors()}
                    variant="contained"
                    onClick={async () => {
                      const {
                        order: { firstname, lastname, email, products }
                      } = newData;
                      // get product names in object shape and add into validation method
                      const productNames = extractProductName(products);
                      if (
                        isRequired({
                          firstname,
                          lastname,
                          email,
                          ...productNames
                        }) === false
                      ) {
                        try {
                          const {
                            order: { incrementProductID, products, ...order }
                          } = newData;
                          const {
                            data: {
                              createOrder: { order: orderCreateResponse }
                            }
                          } = await createOrder({
                            variables: {
                              order: {
                                ...order,
                                products: products.map(
                                  ({
                                    productID,
                                    productname,
                                    selectedQuantity
                                  }) => ({
                                    productID,
                                    productname,
                                    selectedQuantity
                                  })
                                )
                              }
                            }
                          });
                          closeModal();
                          resetForm();
                          toast.addToastMessage({
                            content: (
                              <FormatOrderResponse
                                title="New Order was succesfully created"
                                body={orderCreateResponse}
                              />
                            ),
                            type: "success",
                            delay: 3000
                          });
                        } catch (createOrderError) {
                          handleServerErrors(createOrderError);
                        }
                      }
                    }}
                  >
                    Create Order
                  </Button>
                </DialogActions>
              </Grid>
            </Grid>
          </div>
        )}
      </Mutation>
    </Dialog>
  );
};

DialogCreateOrder.propTypes = {
  closeModal: PropTypes.func.isRequired,
  data: PropTypes.shape({
    pageNumber: PropTypes.number,
    itemsCountPerPage: PropTypes.number
  }).isRequired,
  extractProductName: PropTypes.func.isRequired,
  newData: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  resetForm: PropTypes.func.isRequired,
  title: PropTypes.string,
  toast: toastPropTypes,
  validationFunctions: PropTypes.objectOf(PropTypes.func)
};

DialogCreateOrder.defaultProps = {
  title: "CREATE ORDER",
  toast: toastDefaultProps,
  validationFunctions: {}
};

export const CREATE_ORDER_MODAL = "CREATE_ORDER_MODAL";
export default withOrderHoc(DialogCreateOrder);
