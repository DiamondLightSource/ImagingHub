import { gql, TypedDocumentNode } from "@apollo/client";
import { TABLEROWWRAPPER_FRAGMENT } from "./TableRowWrapperFragment";
import { TableContentFragment } from "./__generated__/TableContentFragment.generated";

export const TABLECONTENT_FRAGMENT: TypedDocumentNode<TableContentFragment> = gql`
  fragment TableContentFragment on WorkflowConnection {
    pageInfo {
      hasNextPage
      startCursor
      endCursor
    }
    nodes {
      ...TableRowWrapperFragment @unmask
    }
  }
  ${TABLEROWWRAPPER_FRAGMENT}
`;
