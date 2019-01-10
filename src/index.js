import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { ErrorLink } from "apollo-link-error";
import { createUploadLink } from "apollo-upload-client";
import { withClientState } from "apollo-link-state";
import { ApolloProvider } from "react-apollo";
import {
  InMemoryCache
} from "apollo-cache-inmemory";
import { MuiThemeProvider } from "@material-ui/core/styles";
import "normalize.css";
import "./index.scss";
import App from "./App";
import theme from "./styles/theme";
import registerServiceWorker from "./registerServiceWorker";

//TODO for re-authentication use apollo-link-error
const cache = new InMemoryCache({
  addTypename: false
});

const stateLink = withClientState({
  cache,
  defaults: {},
  resolvers: {}
});

// uploadLink and http-link both are terminating links. You can use only one of them
const uploadLink = createUploadLink({
  uri: "http://localhost:8000/graphql",
  includeExtensions: true
});

const errorLink = new ErrorLink();
const client = new ApolloClient({
  cache,
  link: ApolloLink.from([stateLink, errorLink, uploadLink]),
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
