import { GraphQLScalarType } from "graphql";
import format from "date-fns/format";
//TODO need to be implemented

const GraphQLDate = new GraphQLScalarType({
  name: "Date",
  description: "custom scalar Date",
  serialize(value) {
    const date = new Date(value);
    const formatDate = format(date, "DD/MM/YYYY");
    const formatTime = format(date, "hh:mm:ss");
    return `${formatTime} ${formatDate}`;
  },
  parseValue(value) {
    return value.getTime();
  },
  parseLiteral(ast) {
    console.log("ast", ast);
  }
});
const GraphQLUUID = new GraphQLScalarType({
  name: "uuid",
  description: "custom scalar uuid",
  serialize(value) {
    return value
  },
  parseValue(value) {
    return value;
  },
  parseLiteral(ast) {
    console.log("ast", ast);
  }
});

export { GraphQLDate, GraphQLUUID };
