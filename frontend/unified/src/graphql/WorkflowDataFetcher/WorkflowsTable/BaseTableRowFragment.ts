import { gql, TypedDocumentNode } from "@apollo/client";
import { BaseTableRowFragment } from "./__generated__/BaseTableRowFragment.generated";

export const BASETABLEROW_FRAGMENT: TypedDocumentNode<BaseTableRowFragment> = gql`
  fragment BaseTableRowFragment on Workflow {
    name
    parameters
    status {
      __typename
      ... on WorkflowSucceededStatus {
        startTime
      }
    }
  }
`;
