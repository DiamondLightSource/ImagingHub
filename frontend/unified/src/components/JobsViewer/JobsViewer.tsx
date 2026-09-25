import { Suspense, useState } from "react";
import JobsTable from "./JobsTable/JobsTable";
import { Visit } from "@diamondlightsource/sci-react-ui";
import JobDataViewer from "./JobDataViewer";

const JobsViewer = ({ visit }: { visit: Visit }) => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  return (
    <>
      <Suspense>
        <JobsTable
          visit={visit}
          selectedWorkflow={selectedWorkflow}
          setSelectedWorkflow={setSelectedWorkflow}
        />
      </Suspense>
      <JobDataViewer visit={visit} selectedWorkflow={selectedWorkflow} />
    </>
  );
};

export default JobsViewer;
