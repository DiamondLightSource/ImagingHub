import { gql, TypedDocumentNode } from "@apollo/client";
import {
  ParameterConfigurationQuery,
  ParameterConfigurationQueryVariables,
} from "./__generated__/ParameterConfigurationQuery.generated";

export const PARAMETERCONFIGURATION_QUERY: TypedDocumentNode<
  ParameterConfigurationQuery,
  ParameterConfigurationQueryVariables
> = gql`
  query ParameterConfigurationQuery {
    workflowTemplates(filter: { scienceGroup: IMAGING }) {
      __typename
      nodes {
        name
        description
        arguments
      }
    }
  }
`;
