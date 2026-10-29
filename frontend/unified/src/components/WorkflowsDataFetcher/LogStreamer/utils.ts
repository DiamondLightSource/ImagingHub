import { Task } from "../../../types";
import { LogStreamerFragmentFragment } from "./__generated__/LogStreamer.generated";

export const setFetchedTasks = (data: LogStreamerFragmentFragment): Task[] => {
  if (
    data.status &&
    (data.status?.__typename === "WorkflowRunningStatus" ||
      data.status?.__typename === "WorkflowSucceededStatus" ||
      data.status?.__typename === "WorkflowFailedStatus" ||
      data.status?.__typename === "WorkflowErroredStatus")
  ) {
    return data.status.tasks;
  }
  return [];
};
