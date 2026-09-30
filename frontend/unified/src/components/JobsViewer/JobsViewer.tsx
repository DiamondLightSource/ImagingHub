import { Suspense, useState } from "react";
import JobsTable from "./JobsTable/JobsTable";
import { Visit } from "@diamondlightsource/sci-react-ui";
import JobDataViewer from "./JobDataViewer";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  Typography,
} from "@mui/material";
import { ChevronDown } from "lucide-react";

const JobsViewer = ({ visit }: { visit: Visit }) => {
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
          <JobDataViewer visit={visit} selectedWorkflow={selectedWorkflow} />
        </Suspense>
      )}
    </Stack>
  );
};

export default JobsViewer;
