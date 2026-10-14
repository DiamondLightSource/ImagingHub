import { Suspense, useCallback, useState } from "react";
import { Visit } from "@diamondlightsource/sci-react-ui";
import TableContent from "./TableContent";
import { useQuery } from "@apollo/client/react";
import { WORKFLOWSTABLE_QUERY } from "../../../graphql/WorkflowDataFetcher/WorkflowsTable/WorkflowsTableQuery";
import { WorkflowsTableQueryVariables } from "../../../graphql/WorkflowDataFetcher/WorkflowsTable/__generated__/WorkflowsTableQuery.generated";

const WorkflowsTable = ({
  visit,
  setSelectedWorkflow,
  selectedWorkflow,
}: {
  visit: Visit;
  selectedWorkflow: string | null;
  setSelectedWorkflow: (_: string | null) => void;
}) => {
  const [selectedLimit, setSelectedLimit] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [cursor, setCursor] = useState<string | null>(null);

  const onChangeLimit = useCallback((limit: number) => {
    setSelectedLimit(limit);
    setCurrentPage(0);
    setCursor(null);
  }, []);

  const queryVariables: WorkflowsTableQueryVariables = {
    visit,
    limit: selectedLimit,
    cursor,
  };

  const { data } = useQuery(WORKFLOWSTABLE_QUERY, {
    variables: queryVariables,
    pollInterval: 5000,
    fetchPolicy: "cache-and-network",
  });

  return (
    <Suspense>
      {data && (
        <TableContent
          queryData={data.workflows}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          selectedLimit={selectedLimit}
          setSelectedLimit={onChangeLimit}
          setCursor={setCursor}
          setSelectedWorkflow={setSelectedWorkflow}
          selectedWorkflow={selectedWorkflow}
        />
      )}
    </Suspense>
  );
};

export default WorkflowsTable;
