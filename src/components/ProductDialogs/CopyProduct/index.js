import React from "react";
import CreateProduct from "../CreateProduct";
import Loader from "components/Loader";
import { Query } from "react-apollo";
import { FETCH_PRODUCT } from "../../../graphql-client/queries/product";

const DialogCopyProduct = ({ data: { productID }, ...props }) => (
  <Query query={FETCH_PRODUCT} variables={{ productID }}>
    {({ loading, error, data }) => {
      if (loading) return <Loader />;
      if (error) return <div>{error}</div>;
      const {
        product: { productID, ...product }
      } = data;
      return <CreateProduct formData={{ product }} {...props} />;
    }}
  </Query>
);

export const COPY_PRODUCT_MODAL = "COPY_PRODUCT_MODAL";
export default DialogCopyProduct;
