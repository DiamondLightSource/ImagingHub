import React, { FC, useState } from "react";
import {
  Button,
  Stack,
  Menu,
  MenuItem,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Card,
  Typography,
  Divider,
} from "@mui/material";

import { useQuery } from "@apollo/client/react";
import { gql, type TypedDocumentNode } from "@apollo/client";

import {
  LogQueryQuery,
  LogQueryQueryVariables,
} from "./__generated__/InspectLogMeta.generated";
import { Visit } from "@diamondlightsource/sci-react-ui";
import { WorkflowsQueryQuery } from "./JobsViewer/__generated__/JobsTable.generated";

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
  TableInfo: WorkflowsQueryQuery;
};

export const DisplayLogMeta: FC<DisplayLogMetaProps> = (props: {
  visit: Visit;
  TableInfo: WorkflowsQueryQuery;
}) => {
  let artifactUrlAndLogFileTuples: [string, string][] = [];
  let workflownames: string[] = [];
  let y: any = [];

  const style = {
    width: "100%",
    borderColor: "rgba(2, 2, 1, 0.5)",
  };

  //ToDO maybe need to Consider what to display if there is no workflow as then workflowsnames is empty
  if (props.TableInfo !== undefined) {
    props.TableInfo.workflows?.nodes.forEach((workflow) => {
      if (workflow.status?.__typename == "WorkflowSucceededStatus") {
        workflownames.push(workflow.name);
      }
    });
  }

  const [selectedWorkflow, setSelectedWorkflow] = useState(0);

  const { loading, error, data } = useQuery(InspectLog_Query, {
    variables: { visitobj: props.visit, name: workflownames[0] }, //"example-template-599zg" },
  });

  if (data !== undefined && data !== null) {
    if (data.workflow !== undefined && data.workflow !== null) {
      if (data.workflow.status?.__typename == "WorkflowSucceededStatus") {
        data.workflow.status.tasks.forEach((task) => {
          task.artifacts.forEach((artifact) => {
            if (artifact.mimeType == "text/plain") {
              artifactUrlAndLogFileTuples.push([
                artifact.url,
                task.name + ".log",
              ]);
            }
          });
        });
      } else
        y[0] = ["http://localhost:5173/unified", "Error-No-logs-found.log"];
    }
  } else {
    y = ["http://localhost:5173/unified", "Error-No-logs-found.log"];
  }

  const openInNewTab = (url: string) => {
    if (url !== "undefined") {
      const w = window.open(url, "_blank");
      w?.focus();
    }
  };

  function makeButtonArray(artifactUrlsAndLogFilenames: [string, string][]) {
    return (
      <Stack direction="row" spacing={1}>
        {" "}
        {artifactUrlsAndLogFilenames.map(([artifactUrl, logFilename]) => {
          return (
            <Button
              variant="contained"
              onClick={() => openInNewTab(artifactUrl)}
            >
              {" "}
              {logFilename}{" "}
            </Button>
          );
        })}{" "}
      </Stack>
    );
  }

  //Menu handling
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuListItem = (
    event: React.MouseEvent<HTMLElement>,
    index: number
  ) => {
    setSelectedWorkflow(index);
    setAnchorEl(null);
  };

  return (
    <div>
      <Paper sx={{ width: 400 }}>
        <Divider
          flexItem={true}
          sx={{ width: "100%", Color: "rgba(2, 2, 1, 0.5)" }}
          variant="fullWidth"
        />
        <List>
          <ListItemButton onClick={handleClickListItem}>
            <ListItemText
              primary="Select a previous workflow by clicking here"
              secondary={`Workflow: ${workflownames[selectedWorkflow]}`}
            />
          </ListItemButton>
        </List>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          {workflownames.map((option: string, index: number) => (
            <MenuItem
              key={option}
              role="menuitemradio"
              selected={selectedWorkflow === option}
              onClick={(event) => handleMenuListItem(event, index)}
            >
              <ListItemText>{option}</ListItemText>
              <Divider
                flexItem={true}
                variant="fullWidth"
                sx={{ width: "100%", Color: "rgba(2, 2, 1, 0.5)" }}
              />
            </MenuItem>
          ))}
        </Menu>
      </Paper>
      <p />
      <Divider
        flexItem={true}
        variant="fullWidth"
        sx={{ mb: 2, width: "100%", Color: "rgba(2, 2, 1, 0.5)" }}
      />
      <Typography>
        Choose a log from {workflownames[selectedWorkflow]}:
      </Typography>
      <p />
      {makeButtonArray(artifactUrlAndLogFileTuples)}
    </div>
  );
};

export default DisplayLogMeta;
