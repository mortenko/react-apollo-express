import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { ErrorLink } from "apollo-link-error";
import { ApolloLink } from "apollo-link";
import { withClientState } from "apollo-link-state";
import { ApolloClient } from "apollo-client";
import { createUploadLink } from "apollo-upload-client";
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
const errorLink = new ErrorLink();

const client = new ApolloClient({
  link: ApolloLink.from([stateLink, errorLink, uploadLink]),
  cache,
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
