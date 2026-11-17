import { Visit } from "@diamondlightsource/sci-react-ui";
import { Box } from "@mui/material";
import { Suspense } from "react";
import { WorkflowsTableQueryVariables } from "../../../graphql/WorkflowDataFetcher/WorkflowsTable/__generated__/WorkflowsTableQuery.generated";
import { WORKFLOWSTABLE_QUERY } from "../../../graphql/WorkflowDataFetcher/WorkflowsTable/WorkflowsTableQuery";
import { useQuery } from "@apollo/client/react";
import { WorkflowsListContents } from "./WorkflowsListContents";
import { useServerSidePagination } from "../useServerSidePagination";
import { WorkflowFilter } from "../../../../../src/__generated__/types";

type WorkflowsListProps = {
  visit: Visit;
  scanNumber: number | null;
  selectedWorkflow: string | null;
  setSelectedWorkflow: (_: string | null) => void;
};

export const WorkflowsList: React.FC<WorkflowsListProps> = ({
  visit,
  scanNumber,
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
    filter: scanNumber
      ? ({
          parameters: { parameterName: "scanId", value: String(scanNumber) },
        } as WorkflowFilter)
      : null,
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
