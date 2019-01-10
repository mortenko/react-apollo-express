import React from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Button from "components/Button";
import withOrderHoc from "../withOrderHoc";
import { Dialog, DialogTitle, DialogActions } from "components/Dialog";
import styles from "./createOrder.scss";
import BaseOrderForm from "../baseOrderForm";

const DialogCreateOrder = ({
  open,
  closeModal,
  newData,
  extractProductName,
  resetForm,
  validationFunctions: { isRequired, hasValidationErrors },
  ...props
}) => {
  return (
    <Dialog
      maxWidth="md"
      fullWidth={true}
      open={open}
      className={styles.dialog}
    >
      <div className={styles.dialog__container}>
        <Grid container>
          <Grid item xs={12}>
            <DialogTitle className={styles.dialog__title}>
              Create Order
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
                onClick={() => {
                  const {
                    order: { firstname, lastname, email, products }
                  } = newData;
                  // get product names in object shape and add into validation method
                  const productNames = extractProductName(products);
                  if (
                    isRequired({ firstname, lastname, email, ...productNames })
                  ) {
                    console.log("create Order");
                  }
                }}
              >
                Create Order
              </Button>
            </DialogActions>
          </Grid>
        </Grid>
      </div>
    </Dialog>
  );
};

DialogCreateOrder.propTypes = {
  closeModal: PropTypes.func.isRequired,
  extractProductName: PropTypes.func.isRequired,
  newData: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  resetForm: PropTypes.func.isRequired,
  validationFunctions: PropTypes.objectOf(PropTypes.func)
};

DialogCreateOrder.defaultProps = {
  toast: {
    toasts: []
  },
  validationFunctions: {}
};

export const CREATE_ORDER_MODAL = "CREATE_ORDER_MODAL";
export default withOrderHoc(DialogCreateOrder);
