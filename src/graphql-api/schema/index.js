import { makeExecutableSchema } from "graphql-tools";
import { GraphQLUpload } from "apollo-upload-server";
import GraphQLJSON from "graphql-type-json";
import {
  CustomerResolvers,
  OrderResolvers,
  ProductResolvers
} from "../resolvers";
import { CustomScalarTypeResolvers } from "../customScalarTypes";
import { merge } from "lodash";
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
`;

const schema = makeExecutableSchema({
  typeDefs: [
    SchemaDefinition,
    CustomScalarTypes,
    ...Customer,
    ...Product,
    Order,
    OrderItem
  ],
  resolvers: merge(
    { JSON: GraphQLJSON },
    { Upload: GraphQLUpload },
    CustomerResolvers,
    OrderResolvers,
    ProductResolvers,
    CustomScalarTypeResolvers
  ),
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