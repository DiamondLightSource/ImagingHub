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

import { useQuery } from "@apollo/client/react";
import { gql, type TypedDocumentNode } from "@apollo/client";

import {
  LogQueryQuery,
  LogQueryQueryVariables,
} from "./__generated__/InspectLogMeta.generated";
import { Visit } from "@diamondlightsource/sci-react-ui";

export const InspectLog_Query: TypedDocumentNode<
  LogQueryQuery,
  LogQueryQueryVariables
> = gql`
  query logQuery($visitobj: VisitInput!, $name: String!) {
    workflow(visit: $visitobj, name: $name) {
      name
      id
      status {
        __typename
        ... on WorkflowSucceededStatus {
          message
          startTime
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
  }
`;

type DisplayLogMetaProps = {
  visit: Visit;
  workflowName: string;
};

export const DisplayLogMeta: FC<DisplayLogMetaProps> = (props: {
  visit: Visit;
  workflowName: string;
}) => {
  const { loading, error, data } = useQuery(InspectLog_Query, {
    variables: { visitobj: props.visit, name: props.workflowName },
  });

  const artifactUrl: string[] = [];
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
    setCurrenturl(artifactUrl[indexValue]);
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
    let tasknum: number = 0;
    data.workflow.status.tasks.forEach((task: any) => {
      let artnum: number = 0;
      task.artifacts.forEach((artifact: any) => {
        if (artifact.mimeType == "text/plain") {
          artifactUrl.push(artifact.url);
          let tmp: string = tasknum + "-" + artnum + " " + task.name + ".log";
          procData.push(tmp);
          tasknum = tasknum + 1;
          artnum = artnum + 1;
        }
      });
    });
    return procData;
  }

  if (
    data.workflow?.status?.__typename == "WorkflowSucceededStatus" ||
    data.workflow?.status?.__typename == "WorkflowErroredStatus" ||
    data.workflow?.status?.__typename == "WorkflowFailedStatus"
  ) {
    let procData = processLogData(data);
    procData.forEach((tmp) => {
      LogFileTuples.push(tmp);
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
