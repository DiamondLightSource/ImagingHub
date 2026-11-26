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
  selectedWorkflowId: string | null;
  setSelectedWorkflowId: (_: string | null) => void;
  setSelectedWorkflowName: (_: string | null) => void;
};

export const WorkflowsList: React.FC<WorkflowsListProps> = ({
  visit,
  selectedWorkflowId,
  setSelectedWorkflowId,
  setSelectedWorkflowName,
}: WorkflowsListProps) => {
  const {
    cursor,
    currentPage,
    totalPages,
    selectedLimit,
    goToPage,
    updatePageInfo,
  } = useServerSidePagination();

  const queryVariables: WorkflowsTableQueryVariables = {
    visit,
    limit: selectedLimit,
    cursor,
  };

  const { data, previousData } = useQuery(WORKFLOWSTABLE_QUERY, {
    variables: queryVariables,
    pollInterval: 5000,
    fetchPolicy: "cache-and-network",
  });

  const workflows = data?.workflows ?? previousData?.workflows;

  return (
    <Box>
      <Suspense>
        {workflows && (
          <WorkflowsListContents
            queryData={workflows}
            visit={visit}
            currentPage={currentPage}
            totalPages={totalPages}
            setSelectedWorkflowName={setSelectedWorkflowName}
            setSelectedWorkflowId={setSelectedWorkflowId}
            selectedWorkflowId={selectedWorkflowId}
            updatePageInfo={updatePageInfo}
            onPageChange={goToPage}
          />
        )}
      </Suspense>
    </Box>
  );
};
