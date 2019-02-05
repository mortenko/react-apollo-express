import { gql } from "apollo-server-express";

const FETCH_ORDERS = gql`
  query orders($cursor: Int!, $pageNumber: Int!) {
    orders(cursor: $cursor, pageNumber: $pageNumber)
      @connection(key: "orders", filter: ["pageNumber"]) {
      orders {
        orderItemID
        orderID
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

const CREATE_ORDER = gql`
  mutation createOrder($order: CreateOrderInput) {
    createOrder(order: $order) {
      order {
        orderID
        products {
          productID
          productname
          quantity
        }
        totalsumwithoutdph
        totalsumwithdph
      }
      mutationResponse {
        code
        message
        success
      }
    }
  }
`;

const DELETE_ORDER = gql`
  mutation deleteOrder($orderID: Int!) {
    deleteOrder(orderID: $orderID) {
      order {
        orderID
      }
      mutationResponse {
        code
        message
        success
      }
    }
  }
`;

const FETCH_ORDERS_BY_ID = gql`
  query fetchOrdersByID($orderID: Int!) {
    fetchOrdersByID(orderID: $orderID) {
      order {
        orderID
        products {
          productID,
          productname
          pricewithoutdph
          pricewithdph
          quantity
        }
        totalsumwithoutdph
        totalsumwithdph
      }
      mutationResponse {
        code
        message
        success
      }
    }
  }
`;

export { FETCH_ORDERS, CREATE_ORDER, DELETE_ORDER, FETCH_ORDERS_BY_ID };
