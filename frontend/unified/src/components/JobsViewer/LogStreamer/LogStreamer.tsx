import { gql, TypedDocumentNode } from "@apollo/client";
import { Visit } from "@diamondlightsource/sci-react-ui";
import { useSuspenseFragment } from "@apollo/client/react";
import { MenuItem, Select } from "@mui/material";
import { useState } from "react";
import { setFetchedTasks } from "./utils";
import LogStreamContent from "./LogStreamContent";
import { LogStreamerFragmentFragment } from "./__generated__/LogStreamer.generated";

export const LOGSTREAMER_FRAGMENT: TypedDocumentNode<LogStreamerFragmentFragment> = gql`
  fragment LogStreamerFragment on Workflow {
    status {
      __typename
      ... on WorkflowRunningStatus {
        tasks {
          id
          name
          status
        }
      }
      ... on WorkflowSucceededStatus {
        tasks {
          id
          name
          status
        }
      }
      ... on WorkflowFailedStatus {
        tasks {
          id
          name
          status
        }
      }
      ... on WorkflowErroredStatus {
        tasks {
          id
          name
          status
        }
      }
    }
  }
`;

const LogStreamer = ({
  visit,
  selectedWorkflow,
  queryData,
}: {
  visit: Visit;
  selectedWorkflow: string;
  queryData: LogStreamerFragmentFragment;
}) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const { data } = useSuspenseFragment({
    fragment: LOGSTREAMER_FRAGMENT,
    fragmentName: "LogStreamerFragment",
    from: queryData,
  });

  if (!data) return <>No Data</>;

  const fetchedTasks = setFetchedTasks(data);
  return (
    <>
      <Select>
        {fetchedTasks.map((i) => (
          <MenuItem key={i.id} value={i.id}>
            {i.name}
          </MenuItem>
        ))}
      </Select>
      <LogStreamContent
        visit={visit}
        workflowName={selectedWorkflow}
        taskId={selectedTaskId}
      />
    </>
  );
};

export default LogStreamer;
