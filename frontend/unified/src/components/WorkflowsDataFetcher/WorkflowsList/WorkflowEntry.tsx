import { alpha, Box, CircularProgress, Stack, Typography } from "@mui/material";
import { TableContentFragment } from "../../../graphql/WorkflowDataFetcher/WorkflowsTable/__generated__/TableContentFragment.generated";
import { getWorkflowStatusIcon } from "../WorkflowsTable/StatusIcons";

type WorkflowEntryProps = {
  workflow: TableContentFragment["nodes"][0];
  isSelected: boolean;
  setSelectedWorkflow: (_: string | null) => void;
};

export const WorkflowEntry: React.FC<WorkflowEntryProps> = ({
  workflow,
  isSelected,
  setSelectedWorkflow,
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

  return (
    <div
      onClick={() =>
        isSelected
          ? setSelectedWorkflow(null)
          : setSelectedWorkflow(workflow.name)
      }
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
          <Typography variant="subtitle2">{createTimeInfoString()}</Typography>
        </Stack>
      </Box>
    </div>
  );
};
