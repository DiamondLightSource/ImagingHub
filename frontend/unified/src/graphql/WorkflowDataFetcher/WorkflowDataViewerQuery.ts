import { gql, TypedDocumentNode } from "@apollo/client";
import { INSPECTLOGMETA_FRAGMENT } from "./InspectLogMetaFragment";
import { ARTIFACTSELECTOR_FRAGMENT } from "./ArtifactSelectorFragment";
import { LOGSTREAMER_FRAGMENT } from "./LogStreamerFragment";
import {
  WorkflowDataViewerQuery,
  WorkflowDataViewerQueryVariables,
} from "./__generated__/WorkflowDataViewerQuery.generated";

export const WORKFLOWDATAVIEWER_QUERY: TypedDocumentNode<
  WorkflowDataViewerQuery,
  WorkflowDataViewerQueryVariables
> = gql`
  query WorkflowDataViewerQuery($visit: VisitInput!, $name: String!) {
    workflow(visit: $visit, name: $name) {
      name
      id
      ...LogStreamerFragment
      ...InspectLogMetaFragment
      ...ArtifactSelectorFragment
    }
  }
  ${LOGSTREAMER_FRAGMENT}
  ${INSPECTLOGMETA_FRAGMENT}
  ${ARTIFACTSELECTOR_FRAGMENT}
`;
