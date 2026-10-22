import { useState } from "react";
import { Tabs, Tab } from "@mui/material";
import { Visit } from "@diamondlightsource/sci-react-ui";
import LogStreamer from "./LogStreamer/LogStreamer";
import { Plot } from "./Plot/Plot";
import { useSuspenseQuery } from "@apollo/client/react";
import InspectLogMeta from "./InspectLogMeta";
import { WORKFLOWDATAVIEWER_QUERY } from "../../graphql/WorkflowDataFetcher/WorkflowDataViewerQuery";

const WorkflowDataViewer = ({
  visit,
  selectedWorkflow,
}: {
  visit: Visit;
  selectedWorkflow: string;
}) => {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const { data, error } = useSuspenseQuery(WORKFLOWDATAVIEWER_QUERY, {
    variables: {
      visit: visit,
      name: selectedWorkflow,
    },
  });

  if (!data) return <>No data</>;
  if (error) return <>Error: {error.message}</>;
  if (!data.workflow) return <>No workflow data</>;

  return (
    <>
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
          <InspectLogMeta queryData={data.workflow} />
          <LogStreamer
            visit={visit}
            selectedWorkflow={selectedWorkflow}
            queryData={data.workflow}
          />
        </TabContent>

        <TabContent index={0} selectedIndex={tabIndex}>
          <Plot
            workflowName={selectedWorkflow}
            visit={visit}
            queryData={data.workflow}
          />
        </TabContent>
      </>
    </>
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
