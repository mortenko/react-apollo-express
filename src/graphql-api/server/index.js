import express from "express";
import { ApolloServer } from "apollo-server-express";
import myGraphQLSchema from "../schema";
import cors from "cors";

const app = express();
app.use(cors());
const server = new ApolloServer({
  schema: myGraphQLSchema,
  playground: {
    settings: {
      "editor.theme": "light",
      "editor.cursorShape": "block"
    }
  }
});
server.applyMiddleware({ app });
app.listen({ port: 8000 }, () => {
  console.log(`Listening on port 8000${server.graphqlPath}`);
});

