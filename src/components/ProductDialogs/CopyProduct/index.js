import React from "react";
import PropTypes from "prop-types";
import CreateProduct from "../CreateProduct";
import Loader from "components/Loader";
import { Query } from "react-apollo";
import { FETCH_PRODUCT } from "../../../graphql-client/queries/product";

const DialogCopyProduct = ({ data: { productID, ...restData }, ...props }) => (
  <Query query={FETCH_PRODUCT} variables={{ productID }}>
    {({ loading, error, data }) => {
      if (loading) return <Loader />;
      if (error) return <div>{error}</div>;
      const {
        product: { productID, ...product }
      } = data;
      return (
        <CreateProduct
          formData={{ product }}
          title="Copy Product"
          data={restData}
          {...props}
        />
      );
    }}
  </Query>
);

DialogCopyProduct.propTypes = {
  data: PropTypes.shape({
    productID: PropTypes.number,
    restData: PropTypes.object
  }).isRequired
};

export const COPY_PRODUCT_MODAL = "COPY_PRODUCT_MODAL";
export default DialogCopyProduct;
