import { gql, TypedDocumentNode } from "@apollo/client";
import { ArtifactSelectorFragment } from "./__generated__/ArtifactSelectorFragment.generated";

export const ARTIFACTSELECTOR_FRAGMENT: TypedDocumentNode<ArtifactSelectorFragment> = gql`
  fragment ArtifactSelectorFragment on Workflow {
    name
    status {
      __typename
      ... on WorkflowRunningStatus {
        startTime
        tasks {
          id
          name
          artifacts {
            name
            url
            mimeType
          }
        }
      }
      ... on WorkflowSucceededStatus {
        startTime
        tasks {
          id
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
        tasks {
          id
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
        tasks {
          id
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
