import CustomerPhoto from "./customerPhoto";

const Customer = ` 
 type Customer {
  customerID: ID!
  firstname: String
  lastname: String
  phone: String
  email: String
  CustomerPhoto: CustomerPhoto
 } 
 input CustomerInput {
  customerID: ID
  firstname: String!
  lastname: String!
  phone: String!
  email: String!
  }
  
  type File {
    photoFile: Upload!
  }
  
  type CustomerWithFile {
    customer: Customer
    photoFile: File
   }
  
  type Customers implements Pagination {
   customers: [Customer] 
   count: Int!
   cursor: Int!
  }
  interface Pagination {
   count: Int!
   cursor: Int!
  }
  type Query {
    customers(cursor: Int!, pageNumber: Int!): Customers
    customer(customerID: Int!): Customer 
  }
  type Mutation {
    createCustomer(photoFile: Upload!, customer: CustomerInput!): CustomerWithFile
    updateCustomer(photoFile: Upload!, customer: CustomerInput!): CustomerWithFile
    deleteCustomer(customerID: Int!): Customer
  }
`;

export default [Customer, CustomerPhoto];
