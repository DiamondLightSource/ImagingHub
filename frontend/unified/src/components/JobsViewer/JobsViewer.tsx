import { Suspense, useState } from "react";
import JobsTable from "./JobsTable/JobsTable";
import { Divider, Stack, Typography } from "@mui/material";
import DisplayLogMeta from "./InspectLogMeta";
import { Visit, visitToText } from "@diamondlightsource/sci-react-ui";
import Plot from "./Plot/Plot";

const JobsViewer = ({
  visit,
  verticalSpacing = 2,
}: {
  visit: Visit | null;
  verticalSpacing?: number;
}) => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);

  if (!visit) {
    return <>Invalid Visit</>;
  }

  const sessionName = visitToText(visit);

  return (
    <Stack direction="column" spacing={verticalSpacing} width="500px">
      <Typography variant="h5">Jobs</Typography>
      <Suspense>
        <JobsTable
          visit={visit}
          selectedWorkflow={selectedWorkflow}
          setSelectedWorkflow={setSelectedWorkflow}
        />
      </Suspense>

      <Divider sx={{ width: "100%" }} />
      <Typography variant="h5">Log</Typography>
      {selectedWorkflow ? (
        <DisplayLogMeta visit={visit} workflowName={selectedWorkflow} />
      ) : (
        <p>No workflow selected</p>
      )}

      <Divider sx={{ width: "100%" }} />
      <Typography variant="h5">Plot</Typography>
      <Plot workflowName={selectedWorkflow} visit={visit} key={sessionName} />
    </Stack>
  );
};

export default JobsViewer;
