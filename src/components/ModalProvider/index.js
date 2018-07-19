import React from "react";
import DialogCreateCustomer, {
  CREATE_CUSTOMER_MODAL
} from "components/CustomerDialogs/CreateCustomer";
import DialogUpdateCustomer, {
  UPDATE_CUSTOMER_MODAL
} from "components/CustomerDialogs/UpdateCustomer";
import DialogDeleteCustomer, {
  DELETE_CUSTOMER_MODAL
} from "components/CustomerDialogs/DeleteCustomer";

function ModalProvider({ modal: { currentModal, isOpen, ...props } }) {
  switch (currentModal) {
    case CREATE_CUSTOMER_MODAL:
      return <DialogCreateCustomer open={isOpen} {...props} />;
    case UPDATE_CUSTOMER_MODAL:
      return <DialogUpdateCustomer open={isOpen} {...props} />;
    case DELETE_CUSTOMER_MODAL:
      return <DialogDeleteCustomer open={isOpen} {...props} />;
    default:
      return null;
  }
}
export default ModalProvider;
