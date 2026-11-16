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
  query WorkflowDataViewerQuery($id: ID!) {
    workflowById(id: $id) {
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
