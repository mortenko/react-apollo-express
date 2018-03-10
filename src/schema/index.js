import { makeExecutableSchema } from "graphql-tools";
import resolvers from "../resolvers/index";

export const typeDefs = `
 type Customers {
  customerID: ID!
  firstname: String
  lastname: String
  phone: String
  email: String
 }
 
  type Products {
  productID: ID!
  name: String
  description: String
  pricewithoutdph: Float
  pricewithdph: Float
  barcode: Int
 }
 
 type Query {
  customers: [Customers]
  products: [Products]
 }
`;
const schema = makeExecutableSchema({ typeDefs, resolvers  });

export default schema;
