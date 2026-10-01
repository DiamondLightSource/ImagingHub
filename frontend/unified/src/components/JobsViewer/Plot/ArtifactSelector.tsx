import { gql, TypedDocumentNode } from "@apollo/client";
import { ArtifactSelectorFragmentFragment } from "./__generated__/ArtifactSelector.generated";
import { useSuspenseFragment } from "@apollo/client/react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useState } from "react";

export const ARTIFACTSELECTOR_FRAGMENT: TypedDocumentNode<ArtifactSelectorFragmentFragment> = gql`
  fragment ArtifactSelectorFragment on Workflow {
    name
    status {
      __typename
      ... on WorkflowRunningStatus {
        startTime
        tasks {
          id
          name
          artifacts {
            name
            url
            mimeType
          }
        }
      }
      ... on WorkflowSucceededStatus {
        startTime
        tasks {
          id
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
        tasks {
          id
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
        tasks {
          id
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

export type Artifact = {
  name: string;
  url: unknown;
  mimeType: string;
};

type TaskNameAndArtifactTuple = [taskName: string, artifacts: Artifact[]];

type ArtifactSelectorProps = {
  setArtifact: (_: Artifact | null) => void;
  isPlottingEnabled: boolean;
  queryData: ArtifactSelectorFragmentFragment;
};

const IMAGE_ARTIFACT_MIME_TYPES = ["image/jpeg", "image/tiff"];

export const ArtifactSelector: React.FC<ArtifactSelectorProps> = ({
  setArtifact,
  isPlottingEnabled,
  queryData,
}: ArtifactSelectorProps) => {
  const [selectedArtifact, setSelectedArtifact] = useState<string>("");
  const { data } = useSuspenseFragment({
    fragment: ARTIFACTSELECTOR_FRAGMENT,
    fragmentName: "ArtifactSelectorFragment",
    from: queryData,
  });

  const generateArtifactList = (): React.ReactNode[] => {
    switch (data.status?.__typename) {
      case "WorkflowSucceededStatus":
      case "WorkflowRunningStatus":
      case "WorkflowFailedStatus":
      case "WorkflowErroredStatus": {
        const taskNamesAndImageArtifacts: TaskNameAndArtifactTuple[] =
          data.status.tasks
            .map(
              (task) =>
                [
                  task.name,
                  task.artifacts.filter((artifact) =>
                    IMAGE_ARTIFACT_MIME_TYPES.includes(artifact.mimeType)
                  ),
                ] as TaskNameAndArtifactTuple
            )
            .filter(([_, artifacts]) => artifacts.length > 0);

        return taskNamesAndImageArtifacts.map(([taskName, artifacts]) => {
          return artifacts.map((artifact) => {
            const label = `${taskName}: ${artifact.name}`;
            return (
              <MenuItem key={label} value={label} data-artifact={artifact}>
                {label}
              </MenuItem>
            );
          });
        });
      }
      default:
        console.error("Handle other workflow status cases");
        return [<MenuItem>default</MenuItem>];
    }
  };

  return (
    <FormControl fullWidth>
      <InputLabel>Artifact</InputLabel>
      {data.status?.__typename !== "WorkflowPendingStatus" ? (
        <Select
          label="Artifact"
          disabled={!isPlottingEnabled}
          onChange={(_, value) => {
            if (value === null || value === undefined) {
              throw Error(
                "Value of selected artifact should be a component but is null or undefined"
              );
            }
            setSelectedArtifact(value.props.value);
            setArtifact(value.props["data-artifact"]);
          }}
          value={selectedArtifact}
          children={generateArtifactList()}
        />
      ) : (
        <p>No artifacts for pending workflow</p>
      )}
    </FormControl>
  );
};
