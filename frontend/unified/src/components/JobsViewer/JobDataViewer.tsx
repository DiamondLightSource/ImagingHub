import { Divider, Typography } from "@mui/material";
import { Visit } from "@diamondlightsource/sci-react-ui";
import LogStreamer, { LOGSTREAMER_FRAGMENT } from "./LogStreamer/LogStreamer";
import { Plot } from "./Plot/Plot";
import { gql, TypedDocumentNode } from "@apollo/client";
import { useSuspenseQuery } from "@apollo/client/react";
import {
  JobDataViewerQueryQuery,
  JobDataViewerQueryQueryVariables,
} from "./__generated__/JobDataViewer.generated";
import InspectLogMeta, { INSPECTLOGMETA_FRAGMENT } from "./InspectLogMeta";

const JOBDATAVIEWER_QUERY: TypedDocumentNode<
  JobDataViewerQueryQuery,
  JobDataViewerQueryQueryVariables
> = gql`
  query JobDataViewerQuery($visit: VisitInput!, $name: String!) {
    workflow(visit: $visit, name: $name) {
      name
      id
      ...LogStreamerFragment
      ...InspectLogMetaFragment
    }
  }
  ${LOGSTREAMER_FRAGMENT}
  ${INSPECTLOGMETA_FRAGMENT}
`;

const JobDataViewer = ({
  visit,
  selectedWorkflow,
}: {
  visit: Visit;
  selectedWorkflow: string;
}) => {
  const { data, error } = useSuspenseQuery(JOBDATAVIEWER_QUERY, {
    variables: {
      visit: visit,
      name: selectedWorkflow,
    },
  });

  if (error) return <>Error: {error.message}</>;
  if (!data) return <>No data</>;
  if (!data.workflow) return <>No workflow data</>;

  return (
    <>
      <Divider sx={{ width: "100%" }} />
      <Typography variant="h5">Log</Typography>
      {selectedWorkflow ? (
        <InspectLogMeta queryData={data.workflow} />
      ) : (
        <p>No workflow selected</p>
      )}
      <Divider sx={{ width: "100%" }} />
      <Typography variant="h5">Log Stream</Typography>
      {selectedWorkflow ? (
        <LogStreamer
          visit={visit}
          selectedWorkflow={selectedWorkflow}
          queryData={data.workflow}
        />
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
