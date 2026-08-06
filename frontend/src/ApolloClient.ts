import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { OperationTypeNode } from "graphql";
import { createClient } from "graphql-ws";
import { readTokenStore } from "./token";

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_HTTP_ENDPOINT,
});

const authLink = new SetContextLink(({ headers }) => {
  return {
    headers: {
      ...headers,
      Authorization: `Bearer ${readTokenStore()}`,
    },
  };
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: import.meta.env.VITE_GRAPHQL_WS_ENDPOINT,
    connectionParams: () => ({
      Authorization: `Bearer ${readTokenStore()}`,
    }),
  })
);

const splitLink = ApolloLink.split(
  ({ operationType }) => {
    return operationType === OperationTypeNode.SUBSCRIPTION;
  },
  wsLink,
  authLink.concat(httpLink)
);

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
