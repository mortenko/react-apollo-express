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
