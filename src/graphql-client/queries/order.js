import { gql } from "apollo-server-express";

const FETCH_ORDERS = gql`
  query orders($cursor: Int!, $pageNumber: Int!) {
    orders(cursor: $cursor, pageNumber: $pageNumber)
      @connection(key: "orders", filter: ["pageNumber"]) {
      orders {
        orderItemID
        quantity
        totalsumwithoutdph
        totalsumwithdph
        createdAt
        updatedAt
        product {
          productname
        }
        customer {
          firstname
          lastname
          email
        }
      }
      count
    }
  }
`;
export { FETCH_ORDERS };
