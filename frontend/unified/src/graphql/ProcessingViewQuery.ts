import { gql, TypedDocumentNode } from "@apollo/client";
import {
  ProcessingViewQuery,
  ProcessingViewQueryVariables,
} from "./__generated__/ProcessingViewQuery.generated";

export const PROCESSINGVIEW_QUERY: TypedDocumentNode<
  ProcessingViewQuery,
  ProcessingViewQueryVariables
> = gql`
  query ProcessingViewQuery {
    workflowTemplates(filter: { scienceGroup: IMAGING }) {
      __typename
      nodes {
        name
        description
      }
    }
  }
`;
