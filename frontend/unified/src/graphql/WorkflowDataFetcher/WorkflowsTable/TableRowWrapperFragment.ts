import { gql, TypedDocumentNode } from "@apollo/client";
import { BASETABLEROW_FRAGMENT } from "./BaseTableRowFragment";
import { TableRowWrapperFragment } from "./__generated__/TableRowWrapperFragment.generated";

export const TABLEROWWRAPPER_FRAGMENT: TypedDocumentNode<TableRowWrapperFragment> = gql`
  fragment TableRowWrapperFragment on Workflow {
    ...BaseTableRowFragment
    status {
      __typename
    }
    visit {
      proposalCode
      proposalNumber
      number
    }
    name
  }
  ${BASETABLEROW_FRAGMENT}
`;
