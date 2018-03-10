import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { HttpLink } from "apollo-link-http";
import { ApolloClient } from "apollo-client";
import { ApolloProvider } from "react-apollo";
import { InMemoryCache } from "apollo-cache-inmemory";
import "./index.scss";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

const client = new ApolloClient({
  link: new HttpLink({ uri: "http://localhost:8000/graphql" }),
  cache: new InMemoryCache()
});

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
registerServiceWorker();
