import { Suspense } from "react";
import JobsTable from "./JobsTable/JobsTable";
import { Visit } from "@diamondlightsource/sci-react-ui";
import { Divider, Typography } from "@mui/material";
import LogStreamer from "./LogStreamer/LogStreamer";

const JobsViewer = ({
  visit,
  setSelectedWorkflow,
  selectedWorkflow,
}: {
  visit: Visit;
  selectedWorkflow: string | null;
  setSelectedWorkflow: (_: string | null) => void;
}) => {
  return (
    <>
      <Suspense>
        <JobsTable
          visit={visit}
          selectedWorkflow={selectedWorkflow}
          setSelectedWorkflow={setSelectedWorkflow}
        />
      </Suspense>
      <Divider sx={{ width: "100%" }} />
      <Typography variant="h5">Technique</Typography>
      {selectedWorkflow ? (
        <LogStreamer visit={visit} selectedWorkflow={selectedWorkflow} />
      ) : (
        <>No Workflow Selected</>
      )}
    </>
  );
};

export default JobsViewer;
