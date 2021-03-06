import React, { Fragment } from "react";
import { Query } from "react-apollo";
import PropTypes from "prop-types";
import Image from "components/Image";
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow
} from "components/Table";
import {
  CreateButtonAction,
  UpdateButtonAction,
  DeleteButtonAction
} from "components/Table/tableComponents";
import styles from "components/Table/table.scss";
import { CREATE_CUSTOMER_MODAL } from "components/CustomerDialogs/CreateCustomer";
import { UPDATE_CUSTOMER_MODAL } from "components/CustomerDialogs/UpdateCustomer";
import { DELETE_CUSTOMER_MODAL } from "components/CustomerDialogs/DeleteCustomer";
import Loader from "components/Loader";
import Alert from "components/Alert";
import Pagination from "components/Pagination";
import { FETCH_CUSTOMERS } from "../../graphql-client/queries/customer";
import { PersonAdd } from "../../assets/material-ui-icons";
import { enhanceWithContainerHoc } from "../withContainerHoc";

const CustomerPage = ({
  paginationData: { pageNumber, itemsCountPerPage },
  handleChangePage,
  openModal
}) => {
  return (
    <Query
      notifyOnNetworkStatusChange
      query={FETCH_CUSTOMERS}
      variables={{
        cursor: itemsCountPerPage,
        pageNumber
      }}
    >
      {({ loading, error, data, variables: { pageNumber }, refetch }) => {
        if (loading) return <Loader />;
        if (error) return <Alert>Error: ${error.message}</Alert>;
        const {
          customers: { customers, count }
        } = data;
        return (
          <Fragment>
            <Table className={styles.table}>
              <TableHead>
                <TableRow>
                  <TableCell className={styles.table__head}>
                    <CreateButtonAction
                      createAction={() =>
                        openModal(CREATE_CUSTOMER_MODAL, {
                          pageNumber,
                          itemsCountPerPage
                        })
                      }
                      title="Customers Table"
                    >
                      <PersonAdd />
                    </CreateButtonAction>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow className={styles.table__header}>
                  <TableCell>CustomerID</TableCell>
                  <TableCell>Photo </TableCell>
                  <TableCell>Firstname</TableCell>
                  <TableCell>Lastname</TableCell>
                  <TableCell>email</TableCell>
                  <TableCell>phone</TableCell>
                  <TableCell> Edit Customer </TableCell>
                  <TableCell> Delete Customer </TableCell>
                </TableRow>
                {customers.map(
                  ({
                    customerID,
                    firstname,
                    lastname,
                    email,
                    phone,
                    CustomerPhoto: { photo }
                  }) => (
                    <TableRow key={customerID} className={styles.table__row}>
                      <TableCell>
                        <Image
                          alt={photo}
                          height={127}
                          src={photo}
                          width={127}
                        />
                      </TableCell>
                      <TableCell>{customerID}</TableCell>
                      <TableCell>{firstname}</TableCell>
                      <TableCell>{lastname}</TableCell>
                      <TableCell>{email}</TableCell>
                      <TableCell>{phone}</TableCell>
                      <TableCell>
                        <UpdateButtonAction
                          updateAction={() =>
                            openModal(UPDATE_CUSTOMER_MODAL, {
                              customerID: parseInt(customerID)
                            })
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <DeleteButtonAction
                          deleteAction={() =>
                            openModal(DELETE_CUSTOMER_MODAL, {
                              customerID: parseInt(customerID),
                              firstname,
                              lastname
                            })
                          }
                        />
                      </TableCell>
                    </TableRow>
                  )
                )}
                <TableRow className={styles.table__row__pagination}>
                  <TableCell colSpan={8}>
                    <Pagination
                      currentPage={pageNumber}
                      itemsCountPerPage={itemsCountPerPage}
                      totalNumberOfItems={count}
                      onPageChange={pageNumber => {
                        refetch({ pageNumber });
                        handleChangePage(pageNumber);
                      }}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Fragment>
        );
      }}
    </Query>
  );
};

CustomerPage.propTypes = {
  handleChangePage: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  paginationData: PropTypes.shape({
    pageNumber: PropTypes.number,
    itemsCountPerPage: PropTypes.number
  }).isRequired
};

export default enhanceWithContainerHoc(CustomerPage);
