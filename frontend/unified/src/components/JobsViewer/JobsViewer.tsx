import { Suspense } from "react";
import JobsTable from "./JobsTable";
import { WorkflowsQueryQuery } from "./__generated__/JobsTable.generated";

export type Visit = {
  proposalCode: string;
  proposalNumber: number;
  number: number;
};

const JobsViewer = ({
  visit,
  setInfo,
}: {
  visit: Visit;
  setInfo: (_: WorkflowsQueryQuery | undefined) => void;
}) => {
  return (
    <Suspense>
      <JobsTable visit={visit} setInfo={setInfo} />
    </Suspense>
  );
};

export default JobsViewer;
