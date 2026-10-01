import { gql, TypedDocumentNode } from "@apollo/client";
import { Visit } from "@diamondlightsource/sci-react-ui";
import { Box } from "@mui/material";
import {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { LogLine } from "./LogLine";
import { useSubscription } from "@apollo/client/react";
import {
  LogStreamContentSubscriptionSubscription,
  LogStreamContentSubscriptionSubscriptionVariables,
} from "./__generated__/LogStreamContent.generated";

const LOGSTREAMCONTENT_SUBSCRIPTION: TypedDocumentNode<
  LogStreamContentSubscriptionSubscription,
  LogStreamContentSubscriptionSubscriptionVariables
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

const LogStreamContent = ({
  visit,
  workflowName,
  taskId,
}: {
  visit: Visit;
  workflowName: string;
  taskId: string | null;
}) => {
  const [logLines, setLogLines] = useState<string[]>([]);
  const [subscriptionError, setSubscriptionError] = useState<string | null>(
    null
  );
  const [logUnavailable, setLogUnavailable] = useState<boolean>(false);
  const [taskFinished, setTaskFinished] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logLines]);

  return (
    <>
      {taskId && !logUnavailable && !taskFinished && (
        <LogStreamSubscription
          visit={visit}
          workflowName={workflowName}
          taskId={taskId}
          setLogLines={setLogLines}
          setSubscriptionError={setSubscriptionError}
          setLogUnavailable={setLogUnavailable}
          setTaskFinished={setTaskFinished}
        />
      )}
      <Box
        ref={containerRef}
        sx={{
          background: "#000000",
          color: "#FFFFFF",
          overflow: "auto",
          padding: 1,
          fontFamily: "monospace",
          fontSize: "10px",
          height: 180,
          whiteSpace: "pre-wrap",
        }}
      >
        {logUnavailable ? (
          <LogLine>Log not available</LogLine>
        ) : subscriptionError ? (
          <LogLine>{subscriptionError}</LogLine>
        ) : logLines.length > 0 ? (
          logLines.map((line, index) => (
            <Fragment key={index}>
              {(index + 1).toString().padStart(3, " ")} {line}
              {index < logLines.length - 1 && "\n"}
            </Fragment>
          ))
        ) : (
          <LogLine>
            {taskId ? "Waiting for logs..." : "No task selected"}
          </LogLine>
        )}
      </Box>
    </>
  );
};

const LogStreamSubscription = ({
  visit,
  workflowName,
  taskId,
  setLogLines,
  setSubscriptionError,
  setLogUnavailable,
  setTaskFinished,
}: {
  visit: Visit;
  workflowName: string;
  taskId: string;
  setLogLines: Dispatch<SetStateAction<string[]>>;
  setSubscriptionError: Dispatch<SetStateAction<string | null>>;
  setLogUnavailable: Dispatch<SetStateAction<boolean>>;
  setTaskFinished: Dispatch<SetStateAction<boolean>>;
}) => {
  useSubscription(LOGSTREAMCONTENT_SUBSCRIPTION, {
    variables: {
      visit: visit,
      workflowName: workflowName,
      taskId: taskId,
    },
    onData: (payload) => {
      if (payload.data.error) {
        const message = payload.data.error.message;
        console.log("Log subscription error:", message);
        const logUnavailable =
          message.includes("Log not available") ||
          message.includes("NoSuchKey") ||
          message.includes("No logs") ||
          message.includes("Failed to retrieve archived log artifact");
        if (logUnavailable) {
          setSubscriptionError("Log not available");
          setLogUnavailable(true);
          return;
        }
        // For non-terminal errors
        setSubscriptionError("Unable to retrieve task logs");
      }
      const line = payload.data.data?.logs.content;
      if (line) {
        setLogLines((previousLines) => [...previousLines, line]);
      }
    },
    onError: (error) => {
      console.log("Log subscription error:", error.message);
      setSubscriptionError("Unable to retrieve task logs");
    },
    onComplete: () => {
      setTaskFinished(true);
      console.log("Log subscription completed");
    },
  });
  return null;
};

export default LogStreamContent;
