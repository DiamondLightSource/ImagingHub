import { gql, TypedDocumentNode } from "@apollo/client";
import { Visit } from "@diamondlightsource/sci-react-ui";
import {
  GetWorkflowTasksQuery,
  GetWorkflowTasksQueryVariables,
} from "./__generated__/LogStreamer.generated";
import { useQuery } from "@apollo/client/react";
import { MenuItem, Select } from "@mui/material";
import { useState } from "react";
import { setFetchedTasks } from "./utils";
import LogStreamContent from "./LogStreamContent";

const GET_WORKFLOW_TASKS: TypedDocumentNode<
  GetWorkflowTasksQuery,
  GetWorkflowTasksQueryVariables
> = gql`
  query GetWorkflowTasks($visit: VisitInput!, $workflowName: String!) {
    workflow(visit: $visit, name: $workflowName) {
      name
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
  }
`;

const LogStreamer = ({
  visit,
  selectedWorkflow,
}: {
  visit: Visit;
  selectedWorkflow: string;
}) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const { data, loading, error } = useQuery(GET_WORKFLOW_TASKS, {
    variables: {
      visit: visit,
      workflowName: selectedWorkflow,
    },
  });

  if (loading) return <>Loading...</>;
  if (error) return <>Error: {error.message}</>;
  if (!data) return <>No Data</>;
  if (!data.workflow) return <>No Workflow Found</>;

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
