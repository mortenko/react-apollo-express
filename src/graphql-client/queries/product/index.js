import { gql } from "apollo-server-express";

const FETCH_PRODUCTS = gql`
  query products($cursor: Int!, $pageNumber: Int!) {
    products(cursor: $cursor, pageNumber: $pageNumber)
      @connection(key: "products", filter: ["pageNumber"]) {
      products {
        productID
        name
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

export { FETCH_PRODUCTS };
