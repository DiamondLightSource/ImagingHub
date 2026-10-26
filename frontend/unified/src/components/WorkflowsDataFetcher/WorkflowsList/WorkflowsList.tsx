import { Visit } from "@diamondlightsource/sci-react-ui";
import { Box } from "@mui/material";
import { Suspense, useCallback, useState } from "react";
import { WorkflowsTableQueryVariables } from "../../../graphql/WorkflowDataFetcher/WorkflowsTable/__generated__/WorkflowsTableQuery.generated";
import { WORKFLOWSTABLE_QUERY } from "../../../graphql/WorkflowDataFetcher/WorkflowsTable/WorkflowsTableQuery";
import { useQuery } from "@apollo/client/react";
import { WorkflowsListContents } from "./WorkflowsListContents";

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
    <Box>
      <Suspense>
        {data && (
          <WorkflowsListContents
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
    </Box>
  );
};
