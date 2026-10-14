import { gql, TypedDocumentNode } from "@apollo/client";
import {
  LogStreamContentSubscription,
  LogStreamContentSubscriptionVariables,
} from "./__generated__/LogStreamContentSubscription.generated";

export const LOGSTREAMCONTENT_SUBSCRIPTION: TypedDocumentNode<
  LogStreamContentSubscription,
  LogStreamContentSubscriptionVariables
> = gql`
  subscription LogStreamContentSubscription(
    $visit: VisitInput!
    $workflowName: String!
    $taskId: String!
  ) {
    logs(visit: $visit, workflowName: $workflowName, taskId: $taskId) {
      content
      podName
    }
  }
`;
