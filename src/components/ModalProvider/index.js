import React from "react";
import PropTypes from "prop-types";

import DialogCreateCustomer, {
  CREATE_CUSTOMER_MODAL
} from "components/CustomerDialogs/CreateCustomer";
import DialogUpdateCustomer, {
  UPDATE_CUSTOMER_MODAL
} from "components/CustomerDialogs/UpdateCustomer";
import DialogDeleteCustomer, {
  DELETE_CUSTOMER_MODAL
} from "components/CustomerDialogs/DeleteCustomer";
import DialogCreateProduct, {
  CREATE_PRODUCT_MODAL
} from "components/ProductDialogs/CreateProduct";
import DialogUpdateProduct, {
  UPDATE_PRODUCT_MODAL
} from "components/ProductDialogs/UpdateProduct";
import DialogDeleteProduct, {
  DELETE_PRODUCT_MODAL
} from "components/ProductDialogs/DeleteProduct";
import DialogCopyProduct, {
  COPY_PRODUCT_MODAL
} from "components/ProductDialogs/CopyProduct";
import DialogCreateOrder, {
  CREATE_ORDER_MODAL
} from "components/OrderDialogs/createOrder";
import DialogDeleteOrder, {
  DELETE_ORDER_MODAL
} from "components/OrderDialogs/deleteOrder";
import DialogCopyOrder, {
  COPY_ORDER_MODAL
} from "components/OrderDialogs/copyOrder";

function ModalProvider({ modal: { currentModal, isOpen, ...props } }) {
  switch (currentModal) {
    case CREATE_CUSTOMER_MODAL:
      return <DialogCreateCustomer open={isOpen} {...props} />;
    case UPDATE_CUSTOMER_MODAL:
      return <DialogUpdateCustomer open={isOpen} {...props} />;
    case DELETE_CUSTOMER_MODAL:
      return <DialogDeleteCustomer open={isOpen} {...props} />;
    case CREATE_PRODUCT_MODAL:
      return <DialogCreateProduct open={isOpen} {...props} />;
    case UPDATE_PRODUCT_MODAL:
      return <DialogUpdateProduct open={isOpen} {...props} />;
    case DELETE_PRODUCT_MODAL:
      return <DialogDeleteProduct open={isOpen} {...props} />;
    case COPY_PRODUCT_MODAL:
      return <DialogCopyProduct open={isOpen} {...props} />;
    case CREATE_ORDER_MODAL:
      return <DialogCreateOrder open={isOpen} {...props} />;
    case DELETE_ORDER_MODAL:
      return <DialogDeleteOrder open={isOpen} {...props} />;
    case COPY_ORDER_MODAL:
      return <DialogCopyOrder open={isOpen} {...props} />;
    default:
      return null;
  }
}

ModalProvider.propTypes = {
  modal: PropTypes.object.isRequired
};

export default ModalProvider;
