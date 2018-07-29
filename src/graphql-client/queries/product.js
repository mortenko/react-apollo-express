import { gql } from "apollo-server-express";

const FETCH_PRODUCTS = gql`
  query products($cursor: Int!, $pageNumber: Int!) {
    products(cursor: $cursor, pageNumber: $pageNumber)
      @connection(key: "products", filter: ["pageNumber"]) {
      products {
        productID
        productname
        description
        pricewithoutdph
        pricewithdph
        barcode
        createdAt
        ProductPhoto {
          photo
          name
        }
      }
      count
    }
  }
`;

const CREATE_PRODUCT = gql`
  mutation createProduct($photoFile: Upload!, $product: ProductInput!) {
    createProduct(photoFile: $photoFile, product: $product) {
      product {
        productname
        description
        pricewithoutdph
        pricewithdph
        barcode
      }
      photoFile {
        photoFile
      }
    }
  }
`;

export { CREATE_PRODUCT, FETCH_PRODUCTS };
