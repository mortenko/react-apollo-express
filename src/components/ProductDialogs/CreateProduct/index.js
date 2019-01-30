import React from "react";
import { Mutation } from "react-apollo";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Button from "components/Button";
import { Dialog, DialogTitle, DialogActions } from "components/Dialog";
import { productPropTypes } from "../propTypes";
import { toastDefaultProps, toastPropTypes } from "../../../globalProps";
import styles from "./createProduct.scss";
import {
  CREATE_PRODUCT,
  FETCH_PRODUCTS
} from "../../../graphql-client/queries/product";
import Loader from "components/Loader";
import BaseProductForm from "../baseProductForm";
import withProductHoc from "../withProductHoc";

const DialogCreateProduct = props => {
  const {
    open,
    closeModal,
    data: { pageNumber, itemsCountPerPage },
    resetForm,
    validationFunctions: {
      isRequired,
      hasValidationErrors,
      handleServerErrors
    },
    newData,
    handleInputChange,
    title,
    toast
  } = props;
  return (
    <Mutation
      mutation={CREATE_PRODUCT}
      refetchQueries={[
        {
          query: FETCH_PRODUCTS,
          variables: { pageNumber, cursor: itemsCountPerPage }
        }
      ]}
    >
      {(createProduct, { loading, error, data }) => {
        if (loading) return <Loader />;
        return (
          <Dialog maxWidth="md" fullWidth open={open} className={styles.dialog}>
            <div className={styles.dialog__container}>
              <Grid container>
                <Grid item xs={12}>
                  <DialogTitle className={styles.dialog__title}>
                    {title}
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
                      danger
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
                      color="primary"
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
  );
};

DialogCreateProduct.propTypes = {
  closeModal: PropTypes.func.isRequired,
  data: PropTypes.shape({
    pageNumber: PropTypes.number,
    itemsCountPerPage: PropTypes.number
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  newData: productPropTypes.isRequired,
  open: PropTypes.bool.isRequired,
  resetForm: PropTypes.func.isRequired,
  title: PropTypes.string,
  toast: toastPropTypes,
  validationFunctions: PropTypes.objectOf(PropTypes.func)
};

DialogCreateProduct.defaultProps = {
  title: "Create Product",
  toast: toastDefaultProps,
  validationFunctions: {}
};

export const CREATE_PRODUCT_MODAL = "CREATE_PRODUCT_MODAL";
export default withProductHoc(DialogCreateProduct);
