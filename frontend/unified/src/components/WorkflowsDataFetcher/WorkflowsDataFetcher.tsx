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
import { Beamline, InstrumentSession } from "../../types";

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
    <>
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
      <Suspense>
        <WorkflowDataViewer
          visit={visit}
          selectedWorkflow={selectedWorkflow}
          beamline={beamline}
          startTime={startTime}
          scanIds={scanIds}
        />
      </Suspense>
    </>
  );
};

export default WorkflowsDataFetcher;
