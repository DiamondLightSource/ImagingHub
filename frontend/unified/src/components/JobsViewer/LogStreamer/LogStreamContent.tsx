import { gql } from "@apollo/client";
import { Visit } from "@diamondlightsource/sci-react-ui";

const LOG_STREAM_SUBSCRIPTION = gql`
  subscription LogStreamSubscription(
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

const LogStreamContent = ({
  visit,
  workflowName,
  taskId,
}: {
  visit: Visit;
  workflowName: string;
  taskId: string | null;
}) => {
  return <></>;
};

export default LogStreamContent;
