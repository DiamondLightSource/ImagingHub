import { Suspense, useState } from "react";
import JobsTable from "./WorkflowsTable/WorkflowsTable";
import { Visit } from "@diamondlightsource/sci-react-ui";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  Typography,
} from "@mui/material";
import { ChevronDown } from "lucide-react";
import WorkflowDataViewer from "./WorkflowDataViewer";
import { WorkflowsList } from "./WorkflowsList/WorkflowsList";
import { WorkflowsViewMode } from "../../types";

const WorkflowsDataFetcher = ({
  visit,
  workflowsViewMode,
}: {
  visit: Visit;
  workflowsViewMode: WorkflowsViewMode;
}) => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);

  return (
    <>
      <Suspense>
        {workflowsViewMode === WorkflowsViewMode.Table ? (
          <Stack display="flex" direction="row">
            <Stack display="flex" flexGrow={1} direction="column">
              <Accordion defaultExpanded>
                <AccordionSummary id="jobs" expandIcon={<ChevronDown />}>
                  <Typography variant="h5">Jobs</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <JobsTable
                    visit={visit}
                    selectedWorkflow={selectedWorkflow}
                    setSelectedWorkflow={setSelectedWorkflow}
                  />
                </AccordionDetails>
              </Accordion>
              {selectedWorkflow && (
                <WorkflowDataViewer
                  visit={visit}
                  selectedWorkflow={selectedWorkflow}
                />
              )}
            </Stack>
          </Stack>
        ) : (
          <Stack direction="row" spacing={1}>
            <Stack spacing={2}>
              <WorkflowsList
                visit={visit}
                selectedWorkflow={selectedWorkflow}
                setSelectedWorkflow={setSelectedWorkflow}
              />
            </Stack>
            {selectedWorkflow && (
              <WorkflowDataViewer
                visit={visit}
                selectedWorkflow={selectedWorkflow}
              />
            )}
          </Stack>
        )}
      </Suspense>
    </>
  );
};

export default WorkflowsDataFetcher;
