import { Typography } from "@mui/material";
import { WorkflowStatus } from "./utils/types";
import {
  CircleAlert,
  CircleCheckBig,
  CircleQuestionMark,
  LoaderCircle,
  ClockFading,
} from "lucide-react";
import React from "react";
import BaseStack from "./utils/BaseStack";

export const getWorkflowStatusIcon = (
  status: WorkflowStatus,
  size: number = 25
) => {
  const workflowStatusIconMap: { [key in WorkflowStatus]: React.JSX.Element } =
    {
      Unknown: (
        <BaseStack colour="yellow">
          <CircleQuestionMark size={size} color="yellow" />
          <Typography color="yellow">Unknown</Typography>
        </BaseStack>
      ),
      WorkflowPendingStatus: (
        <BaseStack colour="yellow">
          <ClockFading size={size} color="yellow" />
          <Typography color="yellow">Pending</Typography>
        </BaseStack>
      ),
      WorkflowRunningStatus: (
        <BaseStack colour="black">
          <LoaderCircle size={size} color="black" />
          <Typography color="black">Running</Typography>
        </BaseStack>
      ),
      WorkflowSucceededStatus: (
        <BaseStack colour="green">
          <CircleCheckBig size={size} color="green" />
          <Typography color="green">Completed</Typography>
        </BaseStack>
      ),
      WorkflowFailedStatus: (
        <BaseStack colour="red">
          <CircleAlert size={size} color="red" />
          <Typography color="red">Failed</Typography>
        </BaseStack>
      ),
      WorkflowErroredStatus: (
        <BaseStack colour="red">
          <CircleAlert size={size} color="red" />
          <Typography color="red">Errored</Typography>
        </BaseStack>
      ),
    };

  return workflowStatusIconMap[status];
};
