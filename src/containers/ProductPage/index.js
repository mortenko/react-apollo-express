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
  CreateButtonAction,
  CopyButtonAction,
  DeleteButtonAction,
  UpdateButtonAction
} from "components/Table/tableComponents";
import styles from "components/Table/table.scss";
import Loader from "components/Loader";
import Alert from "components/Alert";
import { CREATE_PRODUCT_MODAL } from "components/ProductDialogs/CreateProduct";
import { UPDATE_PRODUCT_MODAL } from "components/ProductDialogs/UpdateProduct";
import { DELETE_PRODUCT_MODAL } from "components/ProductDialogs/DeleteProduct";
import { COPY_PRODUCT_MODAL } from "components/ProductDialogs/CopyProduct";
import Pagination from "components/Pagination";
import { enhanceWithContainerHoc } from "../withContainerHoc";
import { NoteAdd } from "../../assets/material-ui-icons";
import { FETCH_PRODUCTS } from "../../graphql-client/queries/product";

const ProductPage = ({
  paginationData: { pageNumber, itemsCountPerPage },
  handleChangePage,
  closeModal,
  openModal
}) => {
  return (
    <Query
      query={FETCH_PRODUCTS}
      variables={{ cursor: itemsCountPerPage, pageNumber }}
      fetchPolicy="network-only"
    >
      {({ loading, error, data, variables: { pageNumber }, refetch }) => {
        if (loading) return <Loader />;
        if (error) return <Alert>Error: ${error.message}</Alert>;
        const {
          products: { products, count }
        } = data;
        return (
          <div>
            <Table className={styles.table}>
              <TableHead>
                <TableRow>
                  <TableCell className={styles.table__head}>
                    <CreateButtonAction
                      title="Products table"
                      createAction={() => openModal(CREATE_PRODUCT_MODAL)}
                    >
                      <NoteAdd />
                    </CreateButtonAction>
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
                    productname,
                    description,
                    pricewithoutdph,
                    pricewithdph,
                    barcode,
                    createdAt,
                    ProductPhoto: { photo }
                  }) => (
                    <TableRow key={productID} className={styles.table__row}>
                      <TableCell>{productID}</TableCell>
                      <TableCell>{productname}</TableCell>
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
                          updateAction={() =>
                            openModal(UPDATE_PRODUCT_MODAL, {
                              productID
                            })
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <DeleteButtonAction
                          deleteAction={() =>
                            openModal(DELETE_PRODUCT_MODAL, {
                              productID,
                              productname
                            })
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <CopyButtonAction
                          copyAction={() =>
                            openModal(COPY_PRODUCT_MODAL, {
                              productID
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
};
ProductPage.propTypes = {
  handleChangePage: PropTypes.func,
  paginationData: PropTypes.shape({
    pageNumber: PropTypes.number,
    itemsCountPerPage: PropTypes.number
  })
}.isRequired;
export default enhanceWithContainerHoc(ProductPage);
