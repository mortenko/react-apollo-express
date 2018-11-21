import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { ErrorLink } from "apollo-link-error";
import { createUploadLink } from "apollo-upload-client";
import { withClientState } from "apollo-link-state";
import { ApolloProvider } from "react-apollo";
import { InMemoryCache } from "apollo-cache-inmemory";
import { MuiThemeProvider } from "@material-ui/core/styles";
import theme from "./styles/theme";
import "normalize.css";
import "./index.scss";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

//TODO for re-authentication use apollo-link-error

const cache = new InMemoryCache({
  addTypename: false
});

const stateLink = withClientState({
  cache,
  resolvers: {
    Mutation: {}
  },
  defaults: {
    customers: { customers: [], count: 0 }
  }
});
const uploadLink = createUploadLink({ uri: "http://localhost:8000/graphql" });
const httpLink = new HttpLink({
  uri: "http://localhost:8000/graphql",
  includeExtensions: true
});
const errorLink = new ErrorLink();
const client = new ApolloClient({
  cache,
  link: ApolloLink.from([stateLink, uploadLink, errorLink, httpLink]),
  connectToDevTools: true
});

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <MuiThemeProvider theme={theme}>
        <App />
      </MuiThemeProvider>
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
registerServiceWorker();
