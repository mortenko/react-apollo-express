import { makeExecutableSchema, GraphQLUpload } from "apollo-server";
import GraphQLJSON from "graphql-type-json";
import { merge } from "lodash";
import {
  CustomerResolvers,
  OrderResolvers,
  ProductResolvers
} from "../resolvers";
import { GraphQLDate, GraphQLUUID } from "../customScalarTypes";
import Customer from "./customer";
import Product from "./product";
import Order from "./order";
import OrderItem from "./orderItem";

const SchemaDefinition = `
 schema {
  query: Query
  mutation: Mutation
 }`;
const SchemaShared = `
  interface IMutationResponse {
    code: Int!
    message: String!
    success: Boolean!
  }
  interface IPagination {
   count: Int!
   cursor: Int!
  }
   type MutationResponse implements IMutationResponse {
    code: Int!
    message: String!
    success: Boolean!
   }
`;

const CustomScalarTypes = `
  scalar Upload
  scalar JSON
  scalar Date
  scalar UUID
`;

const schema = makeExecutableSchema({
  resolvers: merge(
    { JSON: GraphQLJSON },
    { Upload: GraphQLUpload },
    { Date: GraphQLDate },
    { UUID: GraphQLUUID },
    CustomerResolvers,
    OrderResolvers,
    ProductResolvers
  ),
  typeDefs: [
    SchemaDefinition,
    SchemaShared,
    CustomScalarTypes,
    ...Customer,
    ...Product,
    Order,
    OrderItem
  ],
  logger: {
    log: e => {
      console.log(e);
    }
  },
  resolverValidationOptions: {
    requireResolversForNonScalar: true
  }
});

export default schema;
