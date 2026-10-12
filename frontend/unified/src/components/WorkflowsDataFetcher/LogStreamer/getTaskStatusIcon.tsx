import {
  CircleAlert,
  CircleCheckBig,
  CircleEllipsis,
  CircleMinus,
  LoaderCircle,
} from "lucide-react";
import { TaskStatus } from "../../../types";

export const getTaskStatusIcon = (status: TaskStatus) => {
  const taskStatusIconMap: { [key in TaskStatus]: React.JSX.Element } = {
    PENDING: <CircleEllipsis color="orange" />,
    RUNNING: <LoaderCircle />,
    SUCCEEDED: <CircleCheckBig color="green" />,
    SKIPPED: <CircleMinus />,
    FAILED: <CircleAlert />,
    ERROR: <CircleAlert />,
    OMITTED: <CircleMinus />,
  };
  return taskStatusIconMap[status];
};
