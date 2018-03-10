import express from "express";
import bodyParser from "body-parser";
import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import myGraphQLSchema from "../schema/index";

const app = express();

app.use("/graphql", bodyParser.json(), graphqlExpress({ schema: myGraphQLSchema }));
app.get("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));
app.listen(8000, () => {
  console.log("Listening on port 8000");
});
