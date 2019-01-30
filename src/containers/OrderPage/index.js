import React, { Fragment } from "react";
import { Query } from "react-apollo";
import PropTypes from "prop-types";
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow
} from "components/Table";
import {
  CopyButtonAction,
  CreateButtonAction,
  UpdateButtonAction,
  DeleteButtonAction
} from "components/Table/tableComponents";
import styles from "components/Table/table.scss";
import Loader from "components/Loader";
import Alert from "components/Alert";
import Pagination from "components/Pagination";
import { CREATE_ORDER_MODAL } from "components/OrderDialogs/createOrder";
import { FETCH_ORDERS } from "../../graphql-client/queries/order";
import { AddCircle } from "../../assets/material-ui-icons";
import { enhanceWithContainerHoc } from "../withContainerHoc";

const ProductPage = ({
  paginationData: { pageNumber, itemsCountPerPage },
  handleChangePage,
  openModal
}) => {
  return (
    <Query
      query={FETCH_ORDERS}
      variables={{
        cursor: itemsCountPerPage,
        pageNumber
      }}
    >
      {({ loading, error, data, variables: { pageNumber }, refetch }) => {
        if (loading) return <Loader />;
        if (error) return <Alert>Error: ${error.message}</Alert>;
        const {
          orders: { orders, count }
        } = data;
        return (
          <Fragment>
            <Table className={styles.table}>
              <TableHead>
                <TableRow>
                  <TableCell className={styles.table__head}>
                    <CreateButtonAction
                      createAction={() =>
                        openModal(CREATE_ORDER_MODAL, {
                          pageNumber,
                          itemsCountPerPage
                        })
                      }
                      title="Order Table"
                    >
                      <AddCircle />
                    </CreateButtonAction>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow className={styles.table__header}>
                  <TableCell>orderItemID</TableCell>
                  <TableCell>productname </TableCell>
                  <TableCell>total sum without dph </TableCell>
                  <TableCell>total sum with dph </TableCell>
                  <TableCell>quantity</TableCell>
                  <TableCell>firstname</TableCell>
                  <TableCell>lastname</TableCell>
                  <TableCell>email</TableCell>
                  <TableCell>CreatedAt</TableCell>
                  <TableCell>UpdatedAt</TableCell>
                  <TableCell>Update Order</TableCell>
                  <TableCell>Delete Order</TableCell>
                  <TableCell>Copy Order</TableCell>
                </TableRow>
                {orders.map(
                  ({
                    orderItemID,
                    totalsumwithoutdph,
                    totalsumwithdph,
                    quantity,
                    createdAt,
                    updatedAt,
                    product: { productname },
                    customer: { firstname, lastname, email }
                  }) => (
                    <TableRow key={orderItemID} className={styles.table__row}>
                      <TableCell>{orderItemID} </TableCell>
                      <TableCell>{productname}</TableCell>
                      <TableCell>{totalsumwithoutdph}</TableCell>
                      <TableCell>{totalsumwithdph}</TableCell>
                      <TableCell>{quantity}</TableCell>
                      <TableCell>{firstname}</TableCell>
                      <TableCell>{lastname}</TableCell>
                      <TableCell>{email}</TableCell>
                      <TableCell>{createdAt}</TableCell>
                      <TableCell>{updatedAt}</TableCell>
                      <TableCell>
                        <UpdateButtonAction
                          updateAction={() => {
                            console.log("update Order");
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <DeleteButtonAction
                          deleteAction={() => {
                            console.log("delete Order");
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <CopyButtonAction
                          copyAction={() => {
                            console.log("copy  Order");
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  )
                )}
                <TableRow className={styles.table__row__pagination}>
                  <TableCell colSpan={13}>
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

ProductPage.propTypes = {
  handleChangePage: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  paginationData: PropTypes.shape({
    pageNumber: PropTypes.number,
    itemsCountPerPage: PropTypes.number
  }).isRequired
};

export default enhanceWithContainerHoc(ProductPage);
