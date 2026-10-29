import { gql, TypedDocumentNode } from "@apollo/client";
import { TABLECONTENT_FRAGMENT } from "./TableContentFragment";
import {
  WorkflowsTableQuery,
  WorkflowsTableQueryVariables,
} from "./__generated__/WorkflowsTableQuery.generated";

export const WORKFLOWSTABLE_QUERY: TypedDocumentNode<
  WorkflowsTableQuery,
  WorkflowsTableQueryVariables
> = gql`
  query WorkflowsTableQuery($visit: VisitInput!, $limit: Int, $cursor: String) {
    workflows(visit: $visit, limit: $limit, cursor: $cursor) {
      ...TableContentFragment @unmask
    }
  }
  ${TABLECONTENT_FRAGMENT}
`;
