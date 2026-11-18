import { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { Visit } from "@diamondlightsource/sci-react-ui";
import LogStreamer from "./LogStreamer/LogStreamer";
import { Plot } from "./Plot/Plot";
import { useSuspenseQuery } from "@apollo/client/react";
import InspectLogMeta from "./InspectLogMeta";
import { WORKFLOWDATAVIEWER_QUERY } from "../../graphql/WorkflowDataFetcher/WorkflowDataViewerQuery";

const WorkflowDataViewer = ({
  visit,
  selectedWorkflowId,
  selectedWorkflowName,
}: {
  visit: Visit;
  selectedWorkflowId: string;
  selectedWorkflowName: string;
}) => {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const { data, error } = useSuspenseQuery(WORKFLOWDATAVIEWER_QUERY, {
    variables: {
      id: selectedWorkflowId,
    },
  });

  if (!data) return <>No data</>;
  if (error) return <>Error: {error.message}</>;
  if (!data.workflowById) return <>No workflow data</>;

  return (
    <Box flexGrow={2}>
      <Tabs
        variant="fullWidth"
        value={tabIndex}
        onChange={(_, newValue: number) => setTabIndex(newValue)}
      >
        <Tab label="View" />
        <Tab label="Log" />
      </Tabs>
      <>
        <TabContent index={1} selectedIndex={tabIndex}>
          <InspectLogMeta queryData={data.workflowById} />
          <LogStreamer
            visit={visit}
            selectedWorkflowName={selectedWorkflowName}
            queryData={data.workflowById}
          />
        </TabContent>

        <TabContent index={0} selectedIndex={tabIndex}>
          <Plot
            workflowName={selectedWorkflowName}
            queryData={data.workflowById}
          />
        </TabContent>
      </>
    </Box>
  );
};

type TabContentProps = {
  index: number;
  selectedIndex: number;
  children: React.ReactNode;
};

const TabContent = ({ children, index, selectedIndex }: TabContentProps) => {
  return <div hidden={index !== selectedIndex}>{children}</div>;
};

export default WorkflowDataViewer;
