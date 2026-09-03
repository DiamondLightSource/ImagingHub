import { Suspense } from "react";
import JobsTable from "./JobsTable";

export type Visit = {
  proposalCode: string;
  proposalNumber: number;
  number: number;
};

const JobsViewer = ({ visit }: { visit: Visit }) => {
  return (
    <Suspense>
      <JobsTable visit={visit} />
    </Suspense>
  );
};

export default JobsViewer;
