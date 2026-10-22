import { useEffect, useState } from "react";
import { Tabs, Tab } from "@mui/material";
import { Visit } from "@diamondlightsource/sci-react-ui";
import LogStreamer from "./LogStreamer/LogStreamer";
import { Plot } from "./Plot/Plot";
import { useSuspenseQuery } from "@apollo/client/react";
import InspectLogMeta from "./InspectLogMeta";
import { WORKFLOWDATAVIEWER_QUERY } from "../../graphql/WorkflowDataFetcher/WorkflowDataViewerQuery";
import { Beamline, InstrumentSession } from "../../types";
import ProcessingView from "../ProcessingView/ProcessingView";

const EMPTY_WORKFLOW_NAME_QUERY_ERROR = "resource name may not be empty";

const WorkflowDataViewer = ({
  visit,
  selectedWorkflow,
  beamline,
  startTime,
  scanIds,
}: {
  visit: Visit;
  selectedWorkflow: string | null;
  beamline: Beamline;
  startTime: InstrumentSession["startTime"];
  scanIds: number[];
}) => {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const { data, error } = useSuspenseQuery(WORKFLOWDATAVIEWER_QUERY, {
    variables: {
      visit: visit,
      name: selectedWorkflow ?? "",
    },
    errorPolicy: "all",
  });

  useEffect(() => {
    if (!selectedWorkflow) {
      setTabIndex(0);
    }
  }, [selectedWorkflow]);

  if (error && !error.message.includes(EMPTY_WORKFLOW_NAME_QUERY_ERROR))
    return <>Error: {error.message}</>;
  if (!error && !data) return <>No data</>;

  return (
    <>
      <Tabs
        variant="fullWidth"
        value={tabIndex}
        onChange={(_, newValue: number) => setTabIndex(newValue)}
      >
        <Tab label="Process" />
        <Tab
          label="View"
          disabled={
            selectedWorkflow === null ||
            data === undefined ||
            data.workflow === undefined
          }
        />
        <Tab
          label="Log"
          disabled={
            selectedWorkflow === null ||
            data === undefined ||
            data.workflow === undefined
          }
        />
      </Tabs>
      {selectedWorkflow && data && data.workflow && (
        <>
          <TabContent index={2} selectedIndex={tabIndex}>
            <InspectLogMeta queryData={data.workflow} />
            <LogStreamer
              visit={visit}
              selectedWorkflow={selectedWorkflow}
              queryData={data.workflow}
            />
          </TabContent>

          <TabContent index={1} selectedIndex={tabIndex}>
            <Plot
              workflowName={selectedWorkflow}
              visit={visit}
              queryData={data.workflow}
            />
          </TabContent>
        </>
      )}

      <TabContent index={0} selectedIndex={tabIndex}>
        <ProcessingView
          visit={visit}
          beamline={beamline}
          startTime={startTime}
          scanIds={scanIds}
        />
      </TabContent>
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
