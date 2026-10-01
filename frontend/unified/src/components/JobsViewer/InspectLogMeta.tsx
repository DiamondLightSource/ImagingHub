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
import { gql, type TypedDocumentNode } from "@apollo/client";

import { InspectLogMetaFragmentFragment } from "./__generated__/InspectLogMeta.generated";

export const INSPECTLOGMETA_FRAGMENT: TypedDocumentNode<InspectLogMetaFragmentFragment> = gql`
  fragment InspectLogMetaFragment on Workflow {
    status {
      __typename
      ... on WorkflowSucceededStatus {
        startTime
        message
        tasks {
          name
          artifacts {
            name
            url
            mimeType
          }
        }
      }
      ... on WorkflowErroredStatus {
        startTime
        message
        tasks {
          name
          artifacts {
            name
            url
            mimeType
          }
        }
      }
      ... on WorkflowFailedStatus {
        startTime
        message
        tasks {
          name
          artifacts {
            name
            url
            mimeType
          }
        }
      }
    }
  }
`;

type Artifact = {
  name: string;
  url: unknown;
  mimeType: string;
};

type Task = {
  name: string;
  artifacts: Artifact[];
};

const getTasks = (data: InspectLogMetaFragmentFragment): Task[] => {
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
  queryData: InspectLogMetaFragmentFragment;
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
        onClick={() => logUrl && openInNewTab(logUrl)}
      >
        Open Log
      </Button>
    </Stack>
  );
};
export default InspectLogMeta;
