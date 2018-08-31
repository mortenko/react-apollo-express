import React from "react";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";
import queryString from "query-string";
import Grid from "@material-ui/core/Grid";
import Loader from "components/Loader";
import Button from "components/Button";
import {
  InputAdornment,
  TextField,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogStyles
} from "components/Dialog";
import { ToastContext } from "../../../context";
import BaseProductForm from "../baseProductForm";
import { enhanceWithProductHoc } from "../CreateProduct";
import styles from "./updateProduct.scss";
import {
  FETCH_PRODUCTS,
  FETCH_PRODUCT,
  UPDATE_PRODUCT
} from "../../../graphql-client/queries/product";

const UpdateProductForm = props => {
  const {
    validationFunctions: { isRequired, hasValidationErrors },
    handleInputChange,
    location: { search },
    closeModal,
    newData
  } = props;

  return (
    <ToastContext.Consumer>
      {toast => {
        return (
          <Mutation
            mutation={UPDATE_PRODUCT}
            update={(
              cache,
              {
                data: {
                  updateProduct: { product }
                }
              }
            ) => {
              const { page } = queryString.parse(search);
              const parsePageInt = parseInt(page, 10);
              const {
                products: { products }
              } = cache.readQuery({
                query: FETCH_PRODUCTS,
                variables: { pageNumber: parsePageInt }
              });
              const updatedProductsArray = products.map(productFromCache => {
                return productFromCache.productID === product.productID
                  ? product
                  : productFromCache;
              });
              // update product in cache
              cache.writeQuery({
                query: FETCH_PRODUCTS,
                variables: { pageNumber: parsePageInt },
                data: { products: { products: updatedProductsArray } }
              });
              // update product's values when clicked on update customer modal
              cache.writeQuery({
                query: FETCH_PRODUCT,
                variables: {
                  productID: product.productID
                },
                data: { product }
              });
            }}
          >
            {(updateProduct, { loading, error, data }) => {
              if (loading) return <Loader />;
              if (error) return <span>{error.message}</span>;
              return (
                <div className={styles.dialog__container}>
                  <Grid container>
                    <Grid item xs={12}>
                      <DialogTitle className={styles.dialog__title}>
                        Update Product
                      </DialogTitle>
                      <BaseProductForm
                        handleInputChange={handleInputChange}
                        productState={{ ...newData }}
                        {...props}
                      />
                    </Grid>
                    <Grid item xs={12}>
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
                            const {
                              newData: {
                                product: updateProductObj,
                                ///destruct CustomerPhoto from object customer
                                product: {
                                  ProductPhoto: { photo },
                                  ...product
                                }
                              }
                            } = props;
                            // test whole customer
                            if (isRequired(updateProductObj) === false) {
                              try {
                                await updateProduct({
                                  variables: {
                                    photoFile: photo,
                                    product
                                  }
                                });
                                closeModal();
                                toast.addToastMessage({
                                  content: `Product ${
                                    product.productname
                                  } was updated successfully`,
                                  type: "success",
                                  delay: 2500
                                });
                              } catch (error) {
                                console.log("error", error);
                                // handleServerErrors(error);
                              }
                            }
                          }}
                          variant="contained"
                          color="primary"
                          disabled={hasValidationErrors()}
                        >
                          Update Product
                        </Button>
                      </DialogActions>
                    </Grid>
                  </Grid>
                </div>
              );
            }}
          </Mutation>
        );
      }}
    </ToastContext.Consumer>
  );
};
UpdateProductForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  location: PropTypes.objectOf(PropTypes.string),
  newData: PropTypes.shape({
    productID: PropTypes.number,
    productname: PropTypes.string,
    description: PropTypes.string,
    pricewithoutdph: PropTypes.number,
    pricewithdph: PropTypes.number,
    ProductPhoto: PropTypes.shape({
      photo: PropTypes.object,
      name: PropTypes.string
    })
  }).isRequired,
  validationFunctions: PropTypes.objectOf(PropTypes.func)
};
UpdateProductForm.defaultProps = {
  location: { search: "" },
  validationFunctions: {}
};
export default enhanceWithProductHoc(UpdateProductForm);
