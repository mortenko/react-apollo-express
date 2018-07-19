import { GraphQLScalarType } from "graphql";

const CustomScalarTypeResolvers = {
  Date: new GraphQLScalarType({
    name: "Date",
    description: "date custom scalar type",
    serialize(value) {
      return new Date(value);
    },
    parseValue(value) {
      //return new Date(value);
    },
    parseLiteral(ast) {
      // if (ast.kind === Kind.INT) {
      //   return parseInt(ast.value, 10); // ast value is always in string format
      // }
      // return null;
    }
  })
};
export { CustomScalarTypeResolvers };
