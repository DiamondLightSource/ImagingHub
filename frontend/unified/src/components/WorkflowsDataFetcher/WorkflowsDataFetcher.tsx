import { Suspense, useState } from "react";
import JobsTable from "./WorkflowsTable/WorkflowsTable";
import { Visit } from "@diamondlightsource/sci-react-ui";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
        ) : (
          <WorkflowsList visit={visit} />
        )}
      </Suspense>
      <Suspense>
        {selectedWorkflow && (
          <WorkflowDataViewer
            visit={visit}
            selectedWorkflow={selectedWorkflow}
          />
        )}
      </Suspense>
    </>
  );
};

export default WorkflowsDataFetcher;
