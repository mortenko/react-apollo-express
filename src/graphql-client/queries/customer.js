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
      mutationResponse {
        code
        message
        success
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
      mutationResponse {
        code
        message
        success
      }
    }
  }
`;
const DELETE_CUSTOMER = gql`
  mutation deleteCustomer($customerID: Int!) {
    deleteCustomer(customerID: $customerID) {
      customer {
        customerID
      }
      mutationResponse {
        code
        message
        success
      }
    }
  }
`;

const FILTER_CUSTOMER = gql`
  query filter($filterBy: CustomerInputFilter!, $advancedFilterBy: CustomerInputFilter) {
    filter: customerFilter(filterBy: $filterBy, advancedFilterBy: $advancedFilterBy) {
      id
      value
    }
  }
`;

export {
  CREATE_CUSTOMER,
  DELETE_CUSTOMER,
  FETCH_CUSTOMERS,
  FETCH_CUSTOMER,
  FILTER_CUSTOMER,
  UPDATE_CUSTOMER
};
