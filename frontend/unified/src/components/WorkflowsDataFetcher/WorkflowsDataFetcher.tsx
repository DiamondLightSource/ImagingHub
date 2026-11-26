import { Suspense, useState } from "react";
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
import WorkflowsTable from "./WorkflowsTable/WorkflowsTable";

const WorkflowsDataFetcher = ({
  visit,
  workflowsViewMode,
  selectedScans,
}: {
  visit: Visit;
  workflowsViewMode: WorkflowsViewMode;
  selectedScans: SelectedScans;
}) => {
  const [selectedWorkflowName, setSelectedWorkflowName] = useState<
    string | null
  >(null);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(
    null
  );

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
                  <WorkflowsTable
                    visit={visit}
                    selectedWorkflowId={selectedWorkflowId}
                    setSelectedWorkflowId={setSelectedWorkflowId}
                    setSelectedWorkflowName={setSelectedWorkflowName}
                  />
                </AccordionDetails>
              </Accordion>
              {selectedWorkflowId && selectedWorkflowName && (
                <WorkflowDataViewer
                  visit={visit}
                  selectedWorkflowName={selectedWorkflowName}
                  selectedWorkflowId={selectedWorkflowId}
                />
              )}
            </Stack>
          </Stack>
        ) : (
          <Stack direction="row" spacing={1}>
            <WorkflowsList
              visit={visit}
              selectedWorkflowId={selectedWorkflowId}
              setSelectedWorkflowId={setSelectedWorkflowId}
              setSelectedWorkflowName={setSelectedWorkflowName}
            />
            <Stack flexGrow={2}>
              <MetadataDisplay selectedScans={selectedScans} maxColumns={4} />
              {selectedWorkflowId && selectedWorkflowName && (
                <WorkflowDataViewer
                  visit={visit}
                  selectedWorkflowId={selectedWorkflowId}
                  selectedWorkflowName={selectedWorkflowName}
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
