import { gql, TypedDocumentNode } from "@apollo/client";
import { Visit } from "@diamondlightsource/sci-react-ui";
import { Box } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { LogLine } from "./LogLine";
import { apolloClientWorkflows } from "../../../../../src/ApolloClient";
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

  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logLines]);

  return (
    <>
      {taskId && !logUnavailable && (
        <LogStreamSubscription
          visit={visit}
          workflowName={workflowName}
          taskId={taskId}
          setLogLines={setLogLines}
          setSubscriptionError={setSubscriptionError}
          setLogUnavailable={setLogUnavailable}
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
            <>
              {line}
              {index < logLines.length - 1 && "\n"}
            </>
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
}: {
  visit: Visit;
  workflowName: string;
  taskId: string;
  setLogLines: Dispatch<SetStateAction<string[]>>;
  setSubscriptionError: Dispatch<SetStateAction<string | null>>;
  setLogUnavailable: Dispatch<SetStateAction<boolean>>;
}) => {
  apolloClientWorkflows
    .subscribe({
      query: LOGSTREAMCONTENT_SUBSCRIPTION,
      variables: {
        visit: visit,
        workflowName: workflowName,
        taskId: taskId,
      },
    })
    .subscribe({
      next: (result) => {
        const line = result.data?.logs.content;
        if (line) {
          setLogLines((previousLines) => [...previousLines, line]);
        }
      },
      error: (error) => {
        console.log("Log subscription error:", error);
        const message = error instanceof Error ? error.message : String(error);
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
      },
      complete: () => {
        console.log("Log subscription completed");
      },
    });
  return null;
};

export default LogStreamContent;
