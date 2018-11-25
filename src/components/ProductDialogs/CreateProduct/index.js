import React from "react";
import { Mutation } from "react-apollo";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import { ToastContext } from "../../../context";
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
import styles from "./createProduct.scss";
import { CREATE_PRODUCT } from "../../../graphql-client/queries/product";
import Loader from "components/Loader";
import BaseProductForm from "../baseProductForm";
import { compose, withProps } from "recompose";
import withValidator from "../../../utils/validation";
import withProductForm from "../withProductForm";
import { enhanceWithBaseHoc } from "../../Dialog/dialogHoc";

const initialErrorValues = {
  productname: [],
  description: [],
  pricewithoutdph: [],
  // pricewithdph: [],
  barcode: [],
  photo: {}
};
const initialFormValues = {
  product: {
    productname: "",
    description: "",
    pricewithoutdph: "",
    pricewithdph: "",
    barcode: "",
    ProductPhoto: {
      photo: null,
      name: ""
    }
  }
};

export const enhanceWithProductHoc = compose(
  withProps(() => ({ initialErrorValues }), withValidator),
  enhanceWithBaseHoc,
  withProps(() => ({ initialFormValues }), withProductForm),
  withProductForm
);

const DialogCreateProduct = props => {
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
    <ToastContext.Consumer>
      {toast => (
        <Mutation mutation={CREATE_PRODUCT}>
          {(createProduct, { loading, error, data }) => {
            if (loading) return <Loader />;
            return (
              <Dialog
                maxWidth="md"
                fullWidth
                open={open}
                className={styles.dialog}
              >
                <div className={styles.dialog__container}>
                  <Grid container>
                    <Grid item xs={12}>
                      <DialogTitle className={styles.dialog__title}>
                        Create Product
                      </DialogTitle>
                    </Grid>
                    <Grid item xs={12}>
                      <BaseProductForm
                        productState={{ ...newData }}
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
                          onClick={async () => {
                            const {
                              ///destruct ProductPhoto from object product
                              product: {
                                ProductPhoto: { photo },
                                ...product
                              }
                            } = newData;
                            if (isRequired({ ...product, photo }) === false) {
                              try {
                                await createProduct({
                                  variables: {
                                    photoFile: photo,
                                    product
                                  }
                                });
                                closeModal();
                                resetForm();
                                toast.addToastMessage({
                                  content: `Product ${
                                    product.productname
                                  } was created successfully`,
                                  type: "success",
                                  delay: 2500
                                });
                              } catch (createProductError) {
                                handleServerErrors(createProductError);
                              }
                            }
                          }}
                          variant="contained"
                          color="success"
                          disabled={hasValidationErrors()}
                        >
                          Create Product
                        </Button>
                      </DialogActions>
                    </Grid>
                  </Grid>
                </div>
              </Dialog>
            );
          }}
        </Mutation>
      )}
    </ToastContext.Consumer>
  );
};
DialogCreateProduct.propTypes = {
  closeModal: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  newData: PropTypes.shape({
    productname: PropTypes.string,
    description: PropTypes.string,
    pricewithoutdph: PropTypes.number,
    pricewithdph: PropTypes.number,
    barcode: PropTypes.string,
    ProductPhoto: PropTypes.shape({
      photo: PropTypes.object,
      name: PropTypes.string
    })
  }).isRequired,
  open: PropTypes.bool.isRequired,
  resetForm: PropTypes.func.isRequired,
  validationFunctions: PropTypes.objectOf(PropTypes.func)
};
DialogCreateProduct.defaultProps = {
  validationFunctions: {}
};

export const CREATE_PRODUCT_MODAL = "CREATE_PRODUCT_MODAL";

export default enhanceWithProductHoc(DialogCreateProduct);
