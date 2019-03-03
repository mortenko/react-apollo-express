import React from "react";
import PropTypes from "prop-types";
import DialogCreateOrder from "../createOrder";
import Loader from "components/Loader";
import { Query } from "react-apollo";
import { FETCH_ORDERS_BY_ID } from "../../../graphql-client/queries/order";

export const DialogCopyOrder = ({
  data: { orderID, ...restData },
  ...props
}) => (
  <Query
    query={FETCH_ORDERS_BY_ID}
    fetchPolicy="network-only"
    variables={{ orderID }}
  >
    {({ loading, data, error }) => {
      if (loading) return <Loader />;
      if (error) return <p>{error}</p>;
      const {
        fetchOrdersByID: { order }
      } = data;
      return (
        <DialogCreateOrder
          title="COPY ORDER"
          data={restData}
          formData={{ order }}
          {...props}
        />
      );
    }}
  </Query>
);

DialogCopyOrder.propTypes = {
  data: PropTypes.shape({
    orderID: PropTypes.number,
    restData: PropTypes.object
  }).isRequired
};

export const COPY_ORDER_MODAL = "COPY_ORDER_MODAL";
export default DialogCopyOrder;
