import React from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import { Dialog } from "components/Dialog";
import Loader from "components/Loader";
import styles from "./updateProduct.scss";
import { FETCH_PRODUCT } from "../../../graphql-client/queries/product";
import UpdateProductForm from "./updateProductForm";

const DialogUpdateProduct = ({ open, closeModal, data: { productID } }) => {
  return (
    <Dialog
      maxWidth="md"
      fullWidth={true}
      className={styles.dialog}
      open={open}
    >
      <Query query={FETCH_PRODUCT} variables={{ productID }}>
        {({ loading, error, data }) => {
          if (loading) return <Loader />;
          if (error) return <div>{error}</div>;
          return (
            <div>
              <UpdateProductForm
                closeModal={closeModal}
                formData={data}
              />
            </div>
          );
        }}
      </Query>
    </Dialog>
  );
};

DialogUpdateProduct.propTypes = {
  closeModal: PropTypes.func.isRequired,
  data: PropTypes.shape({ productID: PropTypes.number }).isRequired,
  open: PropTypes.bool.isRequired
};

export const UPDATE_PRODUCT_MODAL = "UPDATE_PRODUCT_MODAL";
export default DialogUpdateProduct;
