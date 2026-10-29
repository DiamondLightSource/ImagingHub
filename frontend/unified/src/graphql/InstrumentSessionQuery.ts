import { gql, TypedDocumentNode } from "@apollo/client";
import {
  InstrumentSessionQuery,
  InstrumentSessionQueryVariables,
} from "./__generated__/InstrumentSessionQuery.generated";

export const INSTRUMENTSESSION_QUERY: TypedDocumentNode<
  InstrumentSessionQuery,
  InstrumentSessionQueryVariables
> = gql(`
  query InstrumentSessionQuery($reference: String!, $after: String, $before: String, $first: Int, $last: Int) {
    instrumentSessionByReference(reference: $reference) {
      startTime
      endTime
      instrument {
        key
      }
      proposal {
        title
      }
      datasets(pagination: {first: $first, last: $last, after: $after, before: $before}) {
        pageInfo {
          startCursor
          hasPreviousPage
          hasNextPage
          endCursor
        }
        edges {
          cursor
          node {
            data
            dataSchema
            description
            id
            scanNumber
            title
          }
        }
      }
    }
  }
`);
