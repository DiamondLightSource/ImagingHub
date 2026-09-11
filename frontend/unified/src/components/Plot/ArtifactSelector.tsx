import { gql, TypedDocumentNode } from "@apollo/client";
import {
  GetWorkflowArtifactsQuery,
  GetWorkflowArtifactsQueryVariables,
} from "./__generated__/ArtifactSelector.generated";
import { useSuspenseQuery } from "@apollo/client/react";
import { Visit } from "../JobsViewer/JobsViewer";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { ReactElement, useState } from "react";

const GET_WORKFLOW_ARTIFACTS: TypedDocumentNode<
  GetWorkflowArtifactsQuery,
  GetWorkflowArtifactsQueryVariables
> = gql`
  query GetWorkflowArtifacts($visit: VisitInput!, $name: String!) {
    workflow(visit: $visit, name: $name) {
      name
      status {
        __typename
        ... on WorkflowPendingStatus {
          message
        }
        ... on WorkflowRunningStatus {
          tasks {
            id
            name
            status
            stepType
            artifacts {
              name
              url
              mimeType
            }
          }
        }
        ... on WorkflowSucceededStatus {
          __typename
          startTime
          tasks {
            id
            name
            status
            stepType
            artifacts {
              name
              url
              mimeType
            }
          }
        }
        ... on WorkflowFailedStatus {
          tasks {
            id
            name
            status
            stepType
            artifacts {
              name
              url
              mimeType
            }
          }
        }
        ... on WorkflowErroredStatus {
          tasks {
            id
            name
            status
            stepType
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

type ArtifactSelectorProps = {
  workflowName: string;
  visit: Visit;
  setArtifactUrl: (_: string | null) => void;
  setArtifactMimeType: (_: string | null) => void;
  isPlottingEnabled: boolean;
};

const IMAGE_ARTIFACT_MIME_TYPES = ["image/jpeg", "image/tiff"];

export const ArtifactSelector: React.FC<ArtifactSelectorProps> = ({
  workflowName,
  visit,
  setArtifactUrl,
  setArtifactMimeType,
  isPlottingEnabled,
}: ArtifactSelectorProps) => {
  const [selectedArtifact, setSelectedArtifact] = useState<string>("");
  const { error, data } = useSuspenseQuery(GET_WORKFLOW_ARTIFACTS, {
    variables: {
      name: workflowName,
      visit: visit,
    },
  });

  if (error) return <p>Error: {error.message}</p>;

  const generateArtifactList = (): ReactElement[] => {
    switch (data.workflow?.status?.__typename) {
      case "WorkflowSucceededStatus": {
        const taskNamesAndImageArtifacts = data.workflow.status.tasks
          .map((task) => [
            task.name,
            task.artifacts.filter((artifact) =>
              IMAGE_ARTIFACT_MIME_TYPES.includes(artifact.mimeType)
            ),
          ])
          .filter(([_, artifacts]) => artifacts.length > 0);

        return taskNamesAndImageArtifacts.map(([taskName, artifacts]) => {
          return artifacts.map((artifact) => {
            const label = `${taskName}: ${artifact.name}`;
            return (
              <MenuItem
                key={label}
                value={label}
                data-url={artifact.url}
                data-mime-type={artifact.mimeType}
              >
                {label}
              </MenuItem>
            );
          });
        });
      }
      default:
        console.log("Handle other workflow status cases");
        return [<MenuItem>default</MenuItem>];
    }
  };

  return (
    <FormControl>
      <InputLabel>Artifact</InputLabel>
      <Select
        disabled={!isPlottingEnabled}
        onChange={(_, value) => {
          if (value === null || value === undefined) {
            throw Error(
              "Value of selected artifact should be a component but is null or undefined"
            );
          }
          setSelectedArtifact(value.props.value);
          setArtifactUrl(value.props["data-url"]);
          setArtifactMimeType(value.props["data-mime-type"]);
        }}
        value={selectedArtifact}
        children={generateArtifactList()}
      />
    </FormControl>
  );
};
