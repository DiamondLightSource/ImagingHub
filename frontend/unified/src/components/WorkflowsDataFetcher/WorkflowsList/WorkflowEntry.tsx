import {
  alpha,
  Box,
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { Link2 } from "lucide-react";
import { Visit } from "@diamondlightsource/sci-react-ui";
import { TableContentFragment } from "../../../graphql/WorkflowDataFetcher/WorkflowsTable/__generated__/TableContentFragment.generated";
import { getWorkflowStatusIcon } from "../WorkflowsTable/StatusIcons";

type WorkflowEntryProps = {
  visit: Visit;
  workflow: TableContentFragment["nodes"][0];
  isSelected: boolean;
  setSelectedWorkflowId: (_: string | null) => void;
  setSelectedWorkflowName: (_: string | null) => void;
};

export const WorkflowEntry: React.FC<WorkflowEntryProps> = ({
  visit,
  workflow,
  isSelected,
  setSelectedWorkflowId,
  setSelectedWorkflowName,
}: WorkflowEntryProps) => {
  const createTimeInfoString = () => {
    if (workflow.status?.__typename === "WorkflowRunningStatus") {
      const difference = Date.now() - Date.parse(workflow.status.startTime);
      const mins = Math.floor(difference / 1000 / 60);
      const seconds = Math.floor(difference / 1000) - mins * 60;
      return `${Math.floor(mins)}m ${Math.floor(seconds)}s`;
    } else if (
      workflow.status?.__typename === "WorkflowPendingStatus" ||
      !workflow.status
    ) {
      return "?";
    } else {
      const difference =
        Date.parse(workflow.status.endTime) -
        Date.parse(workflow.status.startTime);
      const mins = Math.floor(difference / 60 / 1000);
      const seconds = Math.floor(difference / 1000) - mins * 60;
      return `${Math.floor(mins)}m ${Math.floor(seconds)}s`;
    }
  };

  const urlBase = import.meta.env.VITE_WORKFLOWS_GRAPHQL_HTTP_ENDPOINT.replace(
    "/graphql",
    ""
  );
  const currentVisit = `${visit.proposalCode}${visit.proposalNumber}-${visit.number}`;
  const workflowURL = `${urlBase}/workflows/${currentVisit}/${workflow.id}`;

  return (
    <div
      onClick={() => {
        if (isSelected) {
          setSelectedWorkflowId(null);
          setSelectedWorkflowName(null);
        } else {
          setSelectedWorkflowId(workflow.id);
          setSelectedWorkflowName(workflow.name);
        }
      }}
    >
      <Box
        className={
          isSelected ? "workflow-entry-selected" : "workflow-entry-unselected"
        }
        paddingY={1}
        paddingX={2}
        sx={(theme) => ({
          "&:hover": {
            backgroundColor: alpha(theme.palette.primary.main, 0.15),
            cursor: "pointer",
          },
          "&.workflow-entry-selected": {
            backgroundColor: alpha(theme.palette.primary.main, 0.25),
          },
        })}
      >
        <Stack direction="row" spacing={1}>
          <Box sx={{ display: "grid" }}>
            <Typography
              gridRow={1}
              gridColumn={1}
              fontWeight="bold"
              visibility={isSelected ? "visible" : "hidden"}
            >
              {workflow.name}
            </Typography>
            <Typography
              gridRow={1}
              gridColumn={1}
              fontWeight="normal"
              visibility={isSelected ? "hidden" : "visible"}
            >
              {workflow.name}
            </Typography>
          </Box>
          {getWorkflowStatusIcon(workflow.status?.__typename ?? "Unknown")}
        </Stack>
        <Stack direction="row" display="flex" alignItems="center" spacing={0.5}>
          {workflow.status?.__typename === "WorkflowRunningStatus" && (
            <CircularProgress variant="indeterminate" size={10} />
          )}
          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title="Link to workflow">
              <IconButton
                size="small"
                aria-label="Link to workflow"
                href={workflowURL}
                target="_blank"
                onClick={(e) => e.stopPropagation()}
              >
                <Link2 />
              </IconButton>
            </Tooltip>
            <Typography variant="subtitle2">
              {createTimeInfoString()}
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </div>
  );
};
