import { Suspense } from "react";
import JobsTable from "./JobsTable";

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
  setInfo: (_: number) => void;
}) => {
  return (
    <Suspense>
      <JobsTable visit={visit} setInfo={setInfo} />
    </Suspense>
  );
};

export default JobsViewer;
