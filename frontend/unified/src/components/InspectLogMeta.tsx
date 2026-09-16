import React, { FC } from "react";
import { Button, Stack } from "@mui/material";

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
  workflowName: string | null;
};

export const DisplayLogMeta: FC<DisplayLogMetaProps> = (props: {
  visit: Visit;
  TableInfo: WorkflowsQueryQuery;
  workflowName: string | null;
}) => {
  let artifactUrlAndLogFileTuples: [string, string][] = [];
  let workflownames: string[] = [];
  let y: any = [];

  //ToDO maybe need to Consider what to display if there is no workflow as then workflowsnames is empty
  if (props.TableInfo !== undefined) {
    props.TableInfo.workflows?.nodes.forEach((workflow) => {
      if (workflow.status?.__typename == "WorkflowSucceededStatus") {
        workflownames.push(workflow.name);
      }
    });
  }

  const { loading, error, data } = useQuery(InspectLog_Query, {
    variables: { visitobj: props.visit, name: workflownames[0] },
  });

  if (data !== undefined) {
    if (data.workflow !== null) {
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
              key={logFilename}
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

  return makeButtonArray(artifactUrlAndLogFileTuples);
};

export default DisplayLogMeta;
