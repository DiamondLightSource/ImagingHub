import { Suspense } from "react";
import JobsTable from "./JobsTable/JobsTable";

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
    <Suspense>
      <JobsTable
        visit={visit}
        selectedWorkflow={selectedWorkflow}
        setSelectedWorkflow={setSelectedWorkflow}
      />
    </Suspense>
  );
};

export default JobsViewer;
