import { gql, TypedDocumentNode } from "@apollo/client";
import {
  SessionSelectorQuery,
  SessionSelectorQueryVariables,
} from "./__generated__/SessionSelectorQuery.generated";

export const SESSIONSELECTOR_QUERY: TypedDocumentNode<
  SessionSelectorQuery,
  SessionSelectorQueryVariables
> = gql`
  query SessionSelectorQuery($reference: String!) {
    instrumentSessionByReference(reference: $reference) {
      instrument {
        name
        key
      }
      instrumentSessionNumber
      proposal {
        proposalNumber
        proposalCategory
      }
      startTime
    }
  }
`;
