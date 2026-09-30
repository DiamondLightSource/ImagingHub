import React, { FC } from "react";
import {
  Button,
  Stack,
  Select,
  SelectChangeEvent,
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

const InspectLogMeta = ({
  queryData,
}: {
  queryData: InspectLogMetaFragmentFragment;
}) => {
  const { data } = useSuspenseFragment({
    fragment: INSPECTLOGMETA_FRAGMENT,
    fragmentName: "InspectLogMetaFragment",
    from: queryData,
  });

  const artifactUrl: string[] = ["about:blank"];
  const LogFileTuples: string[] = ["No log Selected"];
  const [selectLogState, setSelectLogState] = React.useState("No log Selected");
  const [currentUrl, setCurrenturl] = React.useState("");
  const [indexValue, setindexValue] = React.useState(-1);
  const handleSelectState = (event: SelectChangeEvent) => {
    setindexValue(LogFileTuples.indexOf(event.target.value));
    setSelectLogState(event.target.value as string);
    if (selectLogState === undefined) {
      setSelectLogState("No log Selected");
      setindexValue(0);
    }
    setCurrenturl(artifactUrl[LogFileTuples.indexOf(event.target.value)]);
  };

  function reset() {
    if (indexValue === -1) {
      setSelectLogState(LogFileTuples[0]);
    } else {
      setSelectLogState(LogFileTuples[indexValue]);
    }
  }

  React.useEffect(reset, [props.workflowName]);

  if (data === undefined) {
    return <p>Data undefined</p>;
  }

  const openInNewTab = (url: string) => {
    if (url !== "undefined") {
      const w = window.open(url, "_blank");
      w?.focus();
    }
  };

  function processLogData(data: LogQueryQuery) {
    const procData: string[] = [];
    const tmpUrls: string[] = [];
    let tasknum: number = 0;
    data.workflow.status.tasks.forEach((task: any) => {
      let artnum: number = 0;
      task.artifacts.forEach((artifact: any) => {
        if (artifact.mimeType == "text/plain") {
          tmpUrls.push(artifact.url);
          let tmp: string = tasknum + "-" + artnum + " " + task.name + ".log";
          procData.push(tmp);
          tasknum = tasknum + 1;
          artnum = artnum + 1;
        }
      });
    });
    return [procData, tmpUrls];
  }

  if (
    data.workflow?.status?.__typename == "WorkflowSucceededStatus" ||
    data.workflow?.status?.__typename == "WorkflowErroredStatus" ||
    data.workflow?.status?.__typename == "WorkflowFailedStatus"
  ) {
    let [procData, tmpUrls] = processLogData(data);
    procData.forEach((tmp) => {
      LogFileTuples.push(tmp);
    });
    tmpUrls.forEach((tmp) => {
      artifactUrl.push(tmp);
    });
  }
  return (
    <Stack direction="column" spacing={1}>
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel id="InputLabelID">Select a Log</InputLabel>
          {LogFileTuples[0] !== undefined ? (
            <Select
              labelId="InputLabelID"
              id="SelectID"
              label="Select a Log"
              onChange={handleSelectState}
              value={selectLogState}
              defaultValue="No log selected"
            >
              {LogFileTuples.map((logFilename) => {
                return <MenuItem value={logFilename}>{logFilename}</MenuItem>;
              })}
            </Select>
          ) : (
            <p>No logs</p>
          )}
        </FormControl>
      </Box>
      <Button
        key={"ButtonKey"}
        variant="contained"
        onClick={() => openInNewTab(currentUrl)}
      >
        Open Log
      </Button>
    </Stack>
  );
};
export default DisplayLogMeta;
