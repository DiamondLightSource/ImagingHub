import { useFragment } from "@apollo/client/react";
import { TableContentFragment } from "../../../graphql/WorkflowDataFetcher/WorkflowsTable/__generated__/TableContentFragment.generated";
import { TABLECONTENT_FRAGMENT } from "../../../graphql/WorkflowDataFetcher/WorkflowsTable/TableContentFragment";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Box,
  IconButton,
  Paper,
  Stack,
  TablePagination,
  Typography,
} from "@mui/material";
import { WorkflowEntryWrapper } from "./WorkflowEntryWrapper";

type WorkflowsListContentsProps = {
  queryData: TableContentFragment;
  currentPage: number;
  setCurrentPage: (newPage: number) => void;
  selectedLimit: number;
  setSelectedLimit: (newLimit: number) => void;
  setCursor: (newCursor: string | null) => void;
  selectedWorkflow: string | null;
  setSelectedWorkflow: (_: string | null) => void;
};

interface TablePaginationActionProps {
  page: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

export const WorkflowsListContents: React.FC<WorkflowsListContentsProps> = ({
  queryData,
  currentPage,
  setCurrentPage,
  selectedLimit,
  setSelectedLimit,
  setCursor,
  selectedWorkflow,
  setSelectedWorkflow,
}: WorkflowsListContentsProps) => {
  const { complete, data } = useFragment({
    fragment: TABLECONTENT_FRAGMENT,
    fragmentName: "TableContentFragment",
    from: queryData,
  });

  if (!complete) return <div>Not Complete</div>;
  if (!data) return <div>No Data</div>;

  const pageInfo = data.pageInfo;

  const handlePageChange = (_: unknown, newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedLimit(parseInt(event.target.value));
  };

  const TablePaginationActions = ({
    page,
    onPageChange: onPaginationPageChange,
  }: TablePaginationActionProps) => {
    const handlePrevPageButtonClick = (
      event: React.MouseEvent<HTMLButtonElement>
    ) => {
      onPaginationPageChange(event, page - 1);
      setCursor(pageInfo.startCursor);
    };
    const handleNextPageButtonClick = (
      event: React.MouseEvent<HTMLButtonElement>
    ) => {
      onPaginationPageChange(event, page + 1);
      setCursor(pageInfo.endCursor);
    };

    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
          onClick={handlePrevPageButtonClick}
          aria-label="prev page"
          disabled={currentPage === 0}
        >
          <ChevronLeft />
        </IconButton>
        <IconButton
          onClick={handleNextPageButtonClick}
          aria-label="next page"
          disabled={!pageInfo?.hasNextPage}
        >
          <ChevronRight />
        </IconButton>
      </Box>
    );
  };

  return (
    <Paper elevation={0} sx={{ width: 350, height: "100%" }}>
      <Typography variant="h5" padding={2}>
        Jobs
      </Typography>
      <Stack direction="column">
        {data &&
          data.nodes.map((workflow) => [
            <WorkflowEntryWrapper
              key={workflow.name}
              queryData={workflow}
              selectedWorkflow={selectedWorkflow}
              setSelectedWorkflow={setSelectedWorkflow}
            />,
          ])}
      </Stack>
      <TablePagination
        sx={{ borderBottom: "none" }}
        rowsPerPageOptions={[5]}
        rowsPerPage={selectedLimit}
        count={500}
        page={currentPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleChangeRowsPerPage}
        ActionsComponent={TablePaginationActions}
        labelDisplayedRows={({ from, to, page }) =>
          `${from}-${to} on page ${page + 1}`
        }
      />
    </Paper>
  );
};
