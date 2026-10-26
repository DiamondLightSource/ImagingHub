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
import { WorkflowsList } from "./WorkflowsList";
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
          <Stack direction="column">
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
        ) : (
          <Stack direction="row">
            <WorkflowsList
              visit={visit}
              selectedWorkflow={selectedWorkflow}
              setSelectedWorkflow={setSelectedWorkflow}
            />
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
