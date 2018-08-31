import { gql } from "apollo-server-express";

const FETCH_CUSTOMERS = gql`
  query customers($cursor: Int!, $pageNumber: Int!) {
    customers(cursor: $cursor, pageNumber: $pageNumber)
      @connection(key: "customers", filter: ["pageNumber"]) {
      customers {
        customerID
        firstname
        lastname
        email
        phone
        CustomerPhoto {
          photo
        }
      }
      count
    }
  }
`;

const FETCH_CUSTOMER = gql`
  query customer($customerID: Int!) {
    customer(customerID: $customerID)
      @connection(key: "customer", filter: ["customerID"]) {
      customerID
      firstname
      lastname
      email
      phone
      CustomerPhoto {
        photo
        name
      }
    }
  }
`;

const CREATE_CUSTOMER = gql`
  mutation createCustomer($photoFile: Upload!, $customer: CustomerInput!) {
    createCustomer(photoFile: $photoFile, customer: $customer) {
      customer {
        firstname
        lastname
        phone
        email
      }
      photoFile {
        photoFile
      }
    }
  }
`;

const UPDATE_CUSTOMER = gql`
  mutation updateCustomer($photoFile: Upload!, $customer: CustomerInput!) {
    updateCustomer(photoFile: $photoFile, customer: $customer) {
      customer {
        customerID
        firstname
        lastname
        phone
        email
        CustomerPhoto {
          photo
          name
        }
      }
      photoFile {
        photoFile
      }
    }
  }
`;
const DELETE_CUSTOMER = gql`
  mutation deleteCustomer($customerID: Int!) {
    deleteCustomer(customerID: $customerID) {
      customerID
    }
  }
`;

export {
  FETCH_CUSTOMERS,
  FETCH_CUSTOMER,
  CREATE_CUSTOMER,
  UPDATE_CUSTOMER,
  DELETE_CUSTOMER
};
