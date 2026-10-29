import { useState } from "react";
import {
  Button,
  Stack,
  Select,
  MenuItem,
  Box,
  FormControl,
  InputLabel,
} from "@mui/material";

import { useSuspenseFragment } from "@apollo/client/react";
import { InspectLogMetaFragment } from "../../graphql/WorkflowDataFetcher/__generated__/InspectLogMetaFragment.generated";
import { INSPECTLOGMETA_FRAGMENT } from "../../graphql/WorkflowDataFetcher/InspectLogMetaFragment";

type Artifact = {
  name: string;
  url: unknown;
  mimeType: string;
};

type Task = {
  name: string;
  artifacts: Artifact[];
};

const getTasks = (data: InspectLogMetaFragment): Task[] => {
  if (
    data.status &&
    (data.status.__typename === "WorkflowSucceededStatus" ||
      data.status.__typename === "WorkflowErroredStatus" ||
      data.status.__typename === "WorkflowFailedStatus")
  ) {
    return data.status.tasks;
  }
  return [];
};

const InspectLogMeta = ({
  queryData,
}: {
  queryData: InspectLogMetaFragment;
}) => {
  const [logUrl, setLogUrl] = useState<string | null>(null);
  const { data } = useSuspenseFragment({
    fragment: INSPECTLOGMETA_FRAGMENT,
    fragmentName: "InspectLogMetaFragment",
    from: queryData,
  });

  if (!data) return <>No Data</>;

  const artifacts = getTasks(data).flatMap((task, taskIndex) => {
    const filteredArtifacts = task.artifacts.filter(
      (artifact) => artifact.mimeType === "text/plain"
    );
    return filteredArtifacts.map((a, idx) => {
      return {
        url: a.url,
        label: `${taskIndex}-${idx} ${task.name}.log`,
      };
    });
  });

  if (data === undefined) {
    return <p>Data undefined</p>;
  }

  const openInNewTab = (url: string) => {
    if (url !== "undefined") {
      const w = window.open(url, "_blank");
      w?.focus();
    }
  };

  return (
    <Stack direction="column" spacing={1}>
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel id="InputLabelID">Select a Log</InputLabel>
          <Select
            labelId="InputLabelID"
            value={logUrl ? logUrl : "NONE"}
            label="Select a Log"
            onChange={(event) => {
              if (event.target.value === "NONE") {
                setLogUrl(null);
              } else {
                setLogUrl(event.target.value);
              }
            }}
          >
            <MenuItem key="No Log" value="NONE">
              No Task
            </MenuItem>
            {artifacts.map((a, idx) => (
              <MenuItem key={idx} value={a.url as string}>
                {a.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Button
        disabled={!logUrl}
        key={"ButtonKey"}
        variant="contained"
        onClick={async () => {
          if (logUrl) {
            openInNewTab(logUrl);
            const resp = await fetch(logUrl);
            console.log("response to fetching log is: ", resp);
          }
        }}
      >
        Open Log
      </Button>
    </Stack>
  );
};
export default InspectLogMeta;
