import React from "react";
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
import Button from "components/Button";
import Loader from "components/Loader";
import Alert from "components/Alert";
import Pagination, { PaginationHoc } from "components/Pagination";
import { ModalContext } from "../../context";
import { FETCH_CUSTOMERS } from "../../graphql-client/queries/customer";
import { PersonAdd } from "../../assets/material-ui-icons";

const CustomerPage = ({
  paginationData: { pageNumber, itemsCountPerPage },
  handleChangePage
}) => {
  return (
    <ModalContext.Consumer>
      {modal => {
        return (
          <Query
            query={FETCH_CUSTOMERS}
            variables={{
              cursor: itemsCountPerPage,
              pageNumber
            }}
            fetchPolicy="network-only"
            notifyOnNetworkStatusChange
          >
            {({ loading, error, data, variables: { pageNumber }, refetch }) => {
              if (loading) return <Loader />;
              if (error) return <Alert>Error: ${error.message}</Alert>;
              const { customers: { customers, count } } = data;
              return (
                <div>
                  <Table className={styles.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell className={styles.table__head}>
                          <CreateButtonAction
                            title="Customers Table"
                            createAction={() =>
                              modal.openModal(CREATE_CUSTOMER_MODAL)
                            }
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
                          <TableRow
                            className={styles.table__row}
                            key={customerID}
                          >
                            <TableCell>{customerID} </TableCell>
                            <TableCell>
                              <Image
                                width={127}
                                height={127}
                                src={photo}
                                alt={photo}
                              />
                            </TableCell>
                            <TableCell>{firstname}</TableCell>
                            <TableCell>{lastname}</TableCell>
                            <TableCell>{email}</TableCell>
                            <TableCell>{phone}</TableCell>
                            <TableCell>
                              <UpdateButtonAction
                                updateAction={() =>
                                  modal.openModal(UPDATE_CUSTOMER_MODAL, {
                                    customerID
                                  })
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <DeleteButtonAction
                                deleteAction={() =>
                                  modal.openModal(DELETE_CUSTOMER_MODAL, {
                                    customerID,
                                    firstname,
                                    lastname
                                  })
                                }
                              />
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                  <Pagination
                    totalNumberOfItems={count}
                    currentPage={pageNumber}
                    itemsCountPerPage={itemsCountPerPage}
                    onPageChange={pageNumber => {
                      refetch({ pageNumber });
                      handleChangePage(pageNumber);
                    }}
                  />
                </div>
              );
            }}
          </Query>
        );
      }}
    </ModalContext.Consumer>
  );
};

CustomerPage.propTypes = {
  handleChangePage: PropTypes.func,
  paginationData: PropTypes.shape({
    pageNumber: PropTypes.number,
    itemsCountPerPage: PropTypes.number
  })
}.isRequired;

export default PaginationHoc(CustomerPage);
