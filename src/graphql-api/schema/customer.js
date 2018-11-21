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
  
  type CustomerResponse {
    customer: Customer
    photoFile: File
    mutationResponse: MutationResponse
   }
   
  type Customers implements IPagination {
   customers: [Customer] 
   count: Int!
   cursor: Int!
  }
  
  type Query {
    customers(cursor: Int!, pageNumber: Int!): Customers
    customer(customerID: Int!): Customer 
  }
  type Mutation {
    createCustomer(photoFile: Upload!, customer: CustomerInput!): CustomerResponse
    updateCustomer(photoFile: Upload!, customer: CustomerInput!): CustomerResponse
    deleteCustomer(customerID: Int!): CustomerResponse
  }
`;

export default [Customer, CustomerPhoto];
