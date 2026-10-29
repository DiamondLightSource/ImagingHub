import { Suspense } from "react";
import { Visit } from "@diamondlightsource/sci-react-ui";
import TableContent from "./TableContent";
import { useQuery } from "@apollo/client/react";
import { WORKFLOWSTABLE_QUERY } from "../../../graphql/WorkflowDataFetcher/WorkflowsTable/WorkflowsTableQuery";
import { WorkflowsTableQueryVariables } from "../../../graphql/WorkflowDataFetcher/WorkflowsTable/__generated__/WorkflowsTableQuery.generated";
import { useServerSidePagination } from "../useServerSidePagination";

const WorkflowsTable = ({
  visit,
  setSelectedWorkflow,
  selectedWorkflow,
}: {
  visit: Visit;
  selectedWorkflow: string | null;
  setSelectedWorkflow: (_: string | null) => void;
}) => {
  const {
    cursor,
    currentPage,
    setCurrentPage,
    selectedLimit,
    goToPage,
    changeLimit,
    updatePageInfo,
  } = useServerSidePagination();

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
          setSelectedLimit={changeLimit}
          setSelectedWorkflow={setSelectedWorkflow}
          selectedWorkflow={selectedWorkflow}
          updatePageInfo={updatePageInfo}
          onPageChange={goToPage}
        />
      )}
    </Suspense>
  );
};

export default WorkflowsTable;
