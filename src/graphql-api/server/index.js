import express from "express";
import bodyParser from "body-parser";
import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import { apolloUploadExpress } from "apollo-upload-server";
import myGraphQLSchema from "../schema/index";
import cors from "cors";

const app = express();
app.use(cors());

app.use(
  "/graphql",
  bodyParser.json(),
  apolloUploadExpress(),
  graphqlExpress({
    schema: myGraphQLSchema
  })
);
app.get(
  "/graphiql",
  graphiqlExpress({
    endpointURL: "graphql"
  })
);
app.listen(8000, () => {
  console.log("Listening on port 8000");
});
