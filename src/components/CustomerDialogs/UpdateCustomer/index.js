import React from "react";
import { Query } from "react-apollo";
import { Dialog, DialogStyles } from "components/Dialog";
import Loader from "components/Loader";
import styles from "./dialogUpdateCustomer.scss";
import { FETCH_CUSTOMER } from "../../../graphql-client/queries/customer/index";
import UpdateCustomerForm from "./updateCustomerForm";

const DialogUpdateCustomer = ({
  open,
  closeModal,
  data: { customerID },
  ...props
}) => {
  return (
    <Dialog
      maxWidth="md"
      fullWidth={true}
      className={styles.dialog}
      open={open}
      {...props}
    >
      <Query
        query={FETCH_CUSTOMER}
        variables={{ customerID }}
      >
        {({ loading, error, data }) => {
          if (loading) return <Loader />;
          if (error) return <div>{error}</div>;
          return (
            <div>
              <UpdateCustomerForm
                closeModal={closeModal}
                formData={{ ...data }}
              />
            </div>
          );
        }}
      </Query>
    </Dialog>
  );
};

export const UPDATE_CUSTOMER_MODAL = "UPDATE_CUSTOMER_MODAL";

export default DialogUpdateCustomer;
