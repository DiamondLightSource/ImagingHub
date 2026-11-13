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
import { SelectedScans, WorkflowsViewMode } from "../../types";
import { MetadataDisplay } from "../MetadataDisplay";

const WorkflowsDataFetcher = ({
  visit,
  workflowsViewMode,
  selectedScans,
}: {
  visit: Visit;
  workflowsViewMode: WorkflowsViewMode;
  selectedScans: SelectedScans;
}) => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  console.log("selectedScans", selectedScans);
  return (
    <>
      <Suspense>
        {workflowsViewMode === WorkflowsViewMode.Table ? (
          <Stack display="flex" direction="row">
            <Stack display="flex" flexGrow={1} direction="column">
              <MetadataDisplay selectedScans={selectedScans} maxColumns={5} />
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
            <Stack flexGrow={2}>
              <MetadataDisplay selectedScans={selectedScans} maxColumns={4} />
              {selectedWorkflow && (
                <WorkflowDataViewer
                  visit={visit}
                  selectedWorkflow={selectedWorkflow}
                />
              )}
            </Stack>
          </Stack>
        )}
      </Suspense>
    </>
  );
};

export default WorkflowsDataFetcher;
