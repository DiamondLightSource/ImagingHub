import { gql, TypedDocumentNode } from "@apollo/client";
import { LogStreamerFragment } from "./__generated__/LogStreamerFragment.generated";

export const LOGSTREAMER_FRAGMENT: TypedDocumentNode<LogStreamerFragment> = gql`
  fragment LogStreamerFragment on Workflow {
    status {
      __typename
      ... on WorkflowRunningStatus {
        tasks {
          id
          name
          status
        }
      }
      ... on WorkflowSucceededStatus {
        tasks {
          id
          name
          status
        }
      }
      ... on WorkflowFailedStatus {
        tasks {
          id
          name
          status
        }
      }
      ... on WorkflowErroredStatus {
        tasks {
          id
          name
          status
        }
      }
    }
  }
`;
