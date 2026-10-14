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
import { Beamline } from "../../types";
import { InstrumentSession } from "../SessionSelector";

const WorkflowsDataFetcher = ({
  visit,
  beamline,
  startTime,
  scanIds,
}: {
  visit: Visit;

  beamline: Beamline;
  startTime: InstrumentSession["startTime"];
  scanIds: number[];
}) => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  return (
    <Stack direction="column">
      <Suspense>
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
      </Suspense>
      {selectedWorkflow && (
        <Suspense>
          <WorkflowDataViewer
            visit={visit}
            selectedWorkflow={selectedWorkflow}
            beamline={beamline}
            startTime={startTime}
            scanIds={scanIds}
          />
        </Suspense>
      )}
    </Stack>
  );
};

export default WorkflowsDataFetcher;
