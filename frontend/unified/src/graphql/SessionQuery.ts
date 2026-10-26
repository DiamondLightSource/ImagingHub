import { gql, TypedDocumentNode } from "@apollo/client";
import {
  SessionQuery,
  SessionQueryVariables,
} from "./__generated__/SessionQuery.generated";

export const SESSION_QUERY: TypedDocumentNode<
  SessionQuery,
  SessionQueryVariables
> = gql`
  query sessionQuery($username: String!) {
    account(username: $username) {
      instrumentSessionRoles(first: 1) {
        edges {
          node {
            instrumentSession {
              proposal {
                proposalNumber
                proposalCategory
              }
              instrumentSessionNumber
              instrument {
                name
              }
              startTime
            }
          }
        }
      }
    }
  }
`;
