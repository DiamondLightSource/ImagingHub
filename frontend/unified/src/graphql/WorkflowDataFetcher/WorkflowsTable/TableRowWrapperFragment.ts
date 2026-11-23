import { gql, TypedDocumentNode } from "@apollo/client";
import { BASETABLEROW_FRAGMENT } from "./BaseTableRowFragment";
import { TableRowWrapperFragment } from "./__generated__/TableRowWrapperFragment.generated";

export const TABLEROWWRAPPER_FRAGMENT: TypedDocumentNode<TableRowWrapperFragment> = gql`
  fragment TableRowWrapperFragment on Workflow {
    ...BaseTableRowFragment
    status {
      __typename
      ... on WorkflowRunningStatus {
        startTime
      }
      ... on WorkflowSucceededStatus {
        startTime
        endTime
      }
      ... on WorkflowFailedStatus {
        startTime
        endTime
      }
      ... on WorkflowErroredStatus {
        startTime
        endTime
      }
    }
    name
    id
  }
  ${BASETABLEROW_FRAGMENT}
`;
