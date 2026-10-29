import { Visit } from "@diamondlightsource/sci-react-ui";
import { Box } from "@mui/material";
import { Suspense } from "react";
import { WorkflowsTableQueryVariables } from "../../../graphql/WorkflowDataFetcher/WorkflowsTable/__generated__/WorkflowsTableQuery.generated";
import { WORKFLOWSTABLE_QUERY } from "../../../graphql/WorkflowDataFetcher/WorkflowsTable/WorkflowsTableQuery";
import { useQuery } from "@apollo/client/react";
import { WorkflowsListContents } from "./WorkflowsListContents";
import { useServerSidePagination } from "../useServerSidePagination";

type WorkflowsListProps = {
  visit: Visit;
  selectedWorkflow: string | null;
  setSelectedWorkflow: (_: string | null) => void;
};

export const WorkflowsList: React.FC<WorkflowsListProps> = ({
  visit,
  selectedWorkflow,
  setSelectedWorkflow,
}: WorkflowsListProps) => {
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
    <Box>
      <Suspense>
        {data && (
          <WorkflowsListContents
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
    </Box>
  );
};
