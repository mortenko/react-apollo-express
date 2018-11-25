import React from "react";
import { Mutation } from "react-apollo";
import PropTypes from "prop-types";
import queryString from "query-string";
import {
  DELETE_PRODUCT,
  FETCH_PRODUCTS
} from "../../../graphql-client/queries/product";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "components/Dialog";
import Loader from "components/Loader";
import Button from "components/Button";
import { enhanceWithProductHoc } from "../CreateProduct/index";
import { ToastContext } from "../../../context";
import styles from "./deleteProduct.scss";

const DialogDeleteProduct = ({
  open,
  closeModal,
  classes,
  validationFunctions: { handleServerErrors },
  data: { productID, productname },
  location: { search }
}) => {
  return (
    <ToastContext.Consumer>
      {toast => (
        <Mutation
          mutation={DELETE_PRODUCT}
          variables={{ productID }}
          update={cache => {
            const { page } = queryString.parse(search);
            const parsePageInt = parseInt(page, 10);
            const {
              products: { products }
            } = cache.readQuery({
              query: FETCH_PRODUCTS,
              variables: { pageNumber: parsePageInt }
            });
            const deleteProductFromArray = products.filter(productFromCache => {
              if (productFromCache.productID !== productID) {
                return productFromCache;
              }
            });
            cache.writeQuery({
              query: FETCH_PRODUCTS,
              variables: { pageNumber: parsePageInt },
              data: { products: { products: deleteProductFromArray } }
            });
          }}
        >
          {(deleteProduct, { loading, error, data }) => {
            if (loading) return <Loader />;
            return (
              <Dialog
                maxWidth="md"
                open={open}
                fullWidth={true}
                className={styles.dialog}
              >
                <div className={styles.dialog__container}>
                  <DialogTitle className={styles.dialog__title}>
                    Delete Product
                  </DialogTitle>
                  <DialogContent className={styles.dialog__content}>
                    <DialogContentText className={classes.MuiDialogContentText}>
                      <span className={styles.dialog__content__text}>
                        Are you sure you want to delete product:
                        <span>
                          <strong>{productname} </strong>
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
                          await deleteProduct({
                            variables: {
                              productID
                            }
                          });
                          closeModal();
                          toast.addToastMessage({
                            content: `Product ${productname} with ID: ${productID} was deleted successfully`,
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
                      Delete Product
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
DialogDeleteProduct.propTypes = {
  classes: PropTypes.object.isRequired,
  closeModal: PropTypes.func.isRequired,
  data: PropTypes.shape({
    customerID: PropTypes.number,
    firstname: PropTypes.string,
    lastname: PropTypes.string
  }).isRequired,
  location: PropTypes.objectOf(PropTypes.object),
  open: PropTypes.bool.isRequired,
  validationFunctions: PropTypes.objectOf(PropTypes.func).isRequired
};

DialogDeleteProduct.defaultProps = {
  location: { search: "" }
};

export const DELETE_PRODUCT_MODAL = "DELETE_PRODUCT_MODAL";
export default enhanceWithProductHoc(DialogDeleteProduct);
