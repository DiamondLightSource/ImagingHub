import { Task } from "../../../types";
import { GetWorkflowTasksQuery } from "./__generated__/LogStreamer.generated";

export const isWorkflowWithTasks = (status: string) => {
  return (
    status === "WorkflowRunningStatus" ||
    status === "WorkflowSucceededStatus" ||
    status === "WorkflowFailedStatus" ||
    status === "WorkflowErroredStatus"
  );
};

export const setFetchedTasks = (data: GetWorkflowTasksQuery): Task[] => {
  if (
    data.workflow?.status &&
    isWorkflowWithTasks(data.workflow.status.__typename)
  ) {
    return data.workflow.status.tasks;
  }
  return [];
};
