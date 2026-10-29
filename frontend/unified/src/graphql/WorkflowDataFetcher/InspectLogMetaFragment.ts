import { gql, TypedDocumentNode } from "@apollo/client";
import { InspectLogMetaFragment } from "./__generated__/InspectLogMetaFragment.generated";

export const INSPECTLOGMETA_FRAGMENT: TypedDocumentNode<InspectLogMetaFragment> = gql`
  fragment InspectLogMetaFragment on Workflow {
    status {
      __typename
      ... on WorkflowSucceededStatus {
        startTime
        message
        tasks {
          name
          artifacts {
            name
            url
            mimeType
          }
        }
      }
      ... on WorkflowErroredStatus {
        startTime
        message
        tasks {
          name
          artifacts {
            name
            url
            mimeType
          }
        }
      }
      ... on WorkflowFailedStatus {
        startTime
        message
        tasks {
          name
          artifacts {
            name
            url
            mimeType
          }
        }
      }
    }
  }
`;
