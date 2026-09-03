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

const httpLinkWorkflows = new HttpLink({
  uri: import.meta.env.VITE_WORKFLOWS_GRAPHQL_HTTP_ENDPOINT,
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
    url: import.meta.env.VITE_WORKFLOWS_GRAPHQL_WS_ENDPOINT,
    connectionParams: () => ({
      Authorization: `Bearer ${readTokenStore()}`,
    }),
  })
);

const splitLinkWorkflows = ApolloLink.split(
  ({ operationType }) => {
    return operationType === OperationTypeNode.SUBSCRIPTION;
  },
  wsLink,
  authLink.concat(httpLinkWorkflows)
);

export const apolloClientWorkflows = new ApolloClient({
  link: splitLinkWorkflows,
  dataMasking: true,
  cache: new InMemoryCache({
    typePolicies: {
      WorkflowConnection: {
        keyFields: [
          "pageInfo",
          ["hasNextPage", "startCursor", "endCursor"],
          "nodes",
          ["name"],
        ],
      },
      Workflow: {
        keyFields: [
          "status",
          ["__typename"],
          "visit",
          ["proposalCode", "proposalNumber", "number"],
          "name",
        ],
      },
    },
  }),
});

const httpLinkUlims = new HttpLink({
  uri: import.meta.env.VITE_ULIMS_GRAPHQL_HTTP_ENDPOINT,
});

export const apolloClientUlims = new ApolloClient({
  link: authLink.concat(httpLinkUlims),
  cache: new InMemoryCache(),
});
