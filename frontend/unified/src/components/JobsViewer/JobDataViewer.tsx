import { Divider, Typography } from "@mui/material";
import DisplayLogMeta from "./InspectLogMeta";
import { Visit } from "@diamondlightsource/sci-react-ui";
import LogStreamer from "./LogStreamer/LogStreamer";
import { Plot } from "./Plot/Plot";

const JobDataViewer = ({
  visit,
  selectedWorkflow,
}: {
  visit: Visit;
  selectedWorkflow: string | null;
}) => {
  return (
    <>
      <Divider sx={{ width: "100%" }} />
      <Typography variant="h5">Log</Typography>
      {selectedWorkflow !== null ? (
        <DisplayLogMeta visit={visit} workflowName={selectedWorkflow} />
      ) : (
        <p>No workflow selected</p>
      )}
      <Divider sx={{ width: "100%" }} />
      <Typography variant="h5">Log Stream</Typography>
      {selectedWorkflow ? (
        <LogStreamer visit={visit} selectedWorkflow={selectedWorkflow} />
      ) : (
        <>No workflow selected</>
      )}
      <Divider sx={{ width: "100%" }} />
      <Typography variant="h5">Plot</Typography>
      <Plot workflowName={selectedWorkflow} visit={visit} />
    </>
  );
};

export default JobDataViewer;
