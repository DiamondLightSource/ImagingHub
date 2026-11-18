import { useFragment } from "@apollo/client/react";
import { TableContentFragment } from "../../../graphql/WorkflowDataFetcher/WorkflowsTable/__generated__/TableContentFragment.generated";
import { TABLECONTENT_FRAGMENT } from "../../../graphql/WorkflowDataFetcher/WorkflowsTable/TableContentFragment";
import { Box, Paper, Stack, Typography } from "@mui/material";
import { WorkflowEntryWrapper } from "./WorkflowEntryWrapper";
import { useEffect } from "react";
import ListPagination from "./ListPagination";

type WorkflowsListContentsProps = {
  queryData: TableContentFragment;
  visit: Visit;
  currentPage: number;
  totalPages: number;
  selectedWorkflow: string | null;
  setSelectedWorkflow: (_: string | null) => void;
  updatePageInfo: (hasNextPage: boolean, endCursor: string | null) => void;
  onPageChange: (
    page: number,
    endCursor?: string | null,
    hasNextPage?: boolean
  ) => void;
};

export const WorkflowsListContents: React.FC<WorkflowsListContentsProps> = ({
  queryData,
  visit,
  currentPage,
  totalPages,
  selectedWorkflow,
  setSelectedWorkflow,
  updatePageInfo,
  onPageChange,
}: WorkflowsListContentsProps) => {
  const { complete, data } = useFragment({
    fragment: TABLECONTENT_FRAGMENT,
    fragmentName: "TableContentFragment",
    from: queryData,
  });

  const pageInfo = data.pageInfo;

  useEffect(() => {
    updatePageInfo(pageInfo?.hasNextPage, pageInfo?.endCursor ?? null);
  }, [pageInfo, updatePageInfo]);

  if (!complete) return <div>Not Complete</div>;
  if (!data) return <div>No Data</div>;

  return (
    <Paper elevation={0} sx={{ width: 350, height: "100%" }}>
      <Typography variant="h5" padding={2}>
        Jobs
      </Typography>
      <Stack direction="column">
        {data?.nodes.map((workflow) => (
          <WorkflowEntryWrapper
            key={workflow.name}
            queryData={workflow}
            visit={visit}
            selectedWorkflowId={selectedWorkflowId}
            setSelectedWorkflowId={setSelectedWorkflowId}
            setSelectedWorkflowName={setSelectedWorkflowName}
          />
        ))}
      </Stack>
      <Box display="inline-flex" width="100%" justifyContent="center">
        <ListPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </Box>
    </Paper>
  );
};
