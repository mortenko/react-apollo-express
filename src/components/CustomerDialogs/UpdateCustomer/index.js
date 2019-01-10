import React from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import { Dialog } from "components/Dialog";
import Loader from "components/Loader";
import styles from "./updateCustomer.scss";
import { FETCH_CUSTOMER } from "../../../graphql-client/queries/customer";
import UpdateCustomerForm from "./updateCustomerForm";

const DialogUpdateCustomer = ({ open, closeModal, data: { customerID } }) => {
  return (
    <Dialog
      maxWidth="md"
      fullWidth={true}
      className={styles.dialog}
      open={open}
    >
      <Query query={FETCH_CUSTOMER} variables={{ customerID }}>
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

DialogUpdateCustomer.propTypes = {
  closeModal: PropTypes.func.isRequired,
  data: PropTypes.shape({ customerID: PropTypes.number }).isRequired,
  open: PropTypes.bool.isRequired
};

export const UPDATE_CUSTOMER_MODAL = "UPDATE_CUSTOMER_MODAL";
export default DialogUpdateCustomer;
