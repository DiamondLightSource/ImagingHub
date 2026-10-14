import { Visit } from "@diamondlightsource/sci-react-ui";
import { useSuspenseFragment } from "@apollo/client/react";
import {
  FormControl,
  InputLabel,
  ListItemIcon,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { setFetchedTasks } from "./utils";
import { getTaskStatusIcon } from "./getTaskStatusIcon";
import { LogStreamerFragment } from "../../../graphql/WorkflowDataFetcher/__generated__/LogStreamerFragment.generated";
import { LOGSTREAMER_FRAGMENT } from "../../../graphql/WorkflowDataFetcher/LogStreamerFragment";
import LogStreamContent from "./LogStreamContent";

const LogStreamer = ({
  visit,
  selectedWorkflow,
  queryData,
}: {
  visit: Visit;
  selectedWorkflow: string;
  queryData: LogStreamerFragment;
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
    <Stack direction="column" spacing={1}>
      <FormControl>
        <InputLabel id="logstream-select-label">Select Task</InputLabel>
        <Select
          labelId="logstream-select-label"
          value={selectedTaskId ? selectedTaskId : ""}
          onChange={(event) => {
            if (event.target.value === "") {
              setSelectedTaskId(null);
            } else {
              setSelectedTaskId(event.target.value);
            }
          }}
          label="Select Task"
        >
          <MenuItem key="No Task" value="">
            No Task
          </MenuItem>
          {fetchedTasks.map((i) => (
            <MenuItem key={i.id} value={i.id}>
              <Stack direction="row">
                <ListItemIcon sx={{ minWidth: "30px" }}>
                  {getTaskStatusIcon(i.status)}
                </ListItemIcon>
                <Typography>{i.name}</Typography>
              </Stack>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <LogStreamContent
        visit={visit}
        workflowName={selectedWorkflow}
        taskId={selectedTaskId}
        key={`${selectedWorkflow}-${selectedTaskId}`}
      />
    </Stack>
  );
};

export default LogStreamer;
