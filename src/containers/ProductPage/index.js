import React from "react";
import { Query } from "react-apollo";
import PropTypes from "prop-types";
import Image from "components/Image";
import {
  Table,
  TableHead,
  TableBody,
  TableFooter,
  TableCell,
  TableRow
} from "components/Table";
import {
  CopyButtonAction,
  DeleteButtonAction,
  UpdateButtonAction
} from "components/Table/tableComponents";
import styles from "components/Table/table.scss";
import Button from "components/Button";
import Loader from "components/Loader";
import Alert from "components/Alert";
import Pagination, { PaginationHoc } from "components/Pagination";
import { ModalContext } from "../../context";
import { NoteAdd } from "../../assets/material-ui-icons";
import { FETCH_PRODUCTS } from "../../graphql-client/queries/product";

const ProductPage = ({
  paginationData: { pageNumber, itemsCountPerPage },
  handleChangePage
}) => {
  return (
    <ModalContext.Consumer>
      {modal => (
        <Query
          query={FETCH_PRODUCTS}
          variables={{ cursor: itemsCountPerPage, pageNumber }}
          fetchPolicy="network-only"
        >
          {({ loading, error, data, variables: { pageNumber }, refetch }) => {
            if (loading) return <Loader />;
            if (error) return <Alert>Error: ${error.message}</Alert>;
            const { products: { products, count } } = data;
            return (
              <div>
                <Table className={styles.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell className={styles.table__head}>
                        <div className={styles.table__title}>
                          Products table
                        </div>
                        <div>
                          <Button
                            onClick={() => console.log("create new product")}
                            color="success"
                            variant="fab"
                          >
                            <NoteAdd />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow className={styles.table__header}>
                      <TableCell>ProductID</TableCell>
                      <TableCell> Name</TableCell>
                      <TableCell>Product Photo </TableCell>
                      <TableCell> Description</TableCell>
                      <TableCell>Price without DPH </TableCell>
                      <TableCell>Price with DPH </TableCell>
                      <TableCell>Barcode</TableCell>
                      <TableCell>Date of create</TableCell>
                      <TableCell>Update Product</TableCell>
                      <TableCell>Delete Product</TableCell>
                      <TableCell>Copy Product</TableCell>
                    </TableRow>
                    {products.map(
                      ({
                        productID,
                        name,
                        description,
                        pricewithoutdph,
                        pricewithdph,
                        barcode,
                        createdAt,
                        ProductPhoto: { photo }
                      }) => (
                        <TableRow key={productID} className={styles.table__row}>
                          <TableCell>{productID}</TableCell>
                          <TableCell>{name}</TableCell>
                          <TableCell>
                            <Image
                              width={127}
                              height={127}
                              src={photo}
                              alt={photo}
                            />
                          </TableCell>
                          <TableCell>{description}</TableCell>
                          <TableCell>{pricewithoutdph}</TableCell>
                          <TableCell>{pricewithdph}</TableCell>
                          <TableCell>{barcode}</TableCell>
                          <TableCell>{createdAt}</TableCell>
                          <TableCell>
                            <UpdateButtonAction
                              updateAction={() => console.log("update Product")}
                            />
                          </TableCell>
                          <TableCell>
                            <DeleteButtonAction
                              deleteAction={() => console.log("delete Product")}
                            />
                          </TableCell>
                          <TableCell>
                            <CopyButtonAction
                              copyAction={() => console.log("Copy Product")}
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
      )}
    </ModalContext.Consumer>
  );
};

export default PaginationHoc(ProductPage);
