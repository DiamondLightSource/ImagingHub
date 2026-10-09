import { Chip } from "@mui/material";
import { WorkflowStatus } from "./utils/types";
import {
  CircleAlert,
  CircleCheckBig,
  CircleQuestionMark,
  LoaderCircle,
  ClockFading,
} from "lucide-react";
import React from "react";

export const getWorkflowStatusIcon = (status: WorkflowStatus) => {
  const workflowStatusIconMap: { [key in WorkflowStatus]: React.JSX.Element } =
    {
      Unknown: (
        <Chip
          color="default"
          label="Unknown"
          variant="outlined"
          icon={<CircleQuestionMark />}
          sx={{ cursor: "default" }}
        />
      ),
      WorkflowPendingStatus: (
        <Chip
          color="warning"
          label="Pending"
          variant="outlined"
          icon={<ClockFading />}
          sx={{ cursor: "default" }}
        />
      ),
      WorkflowRunningStatus: (
        <Chip
          color="primary"
          label="Running"
          variant="outlined"
          icon={<LoaderCircle />}
          sx={{ cursor: "default" }}
        />
      ),
      WorkflowSucceededStatus: (
        <Chip
          color="success"
          label="Completed"
          variant="outlined"
          icon={<CircleCheckBig />}
          sx={{ cursor: "default" }}
        />
      ),
      WorkflowFailedStatus: (
        <Chip
          color="error"
          label="Failed"
          variant="outlined"
          icon={<CircleAlert />}
          sx={{ cursor: "default" }}
        />
      ),
      WorkflowErroredStatus: (
        <Chip
          color="error"
          label="Errored"
          variant="outlined"
          icon={<CircleAlert />}
          sx={{ cursor: "default" }}
        />
      ),
    };

  return workflowStatusIconMap[status];
};
