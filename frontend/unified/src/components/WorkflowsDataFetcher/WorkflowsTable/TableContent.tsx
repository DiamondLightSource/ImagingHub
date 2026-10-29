import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { useFragment } from "@apollo/client/react";
import { ChangeEvent, MouseEvent, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TableRowWrapper from "./TableRowWrapper";
import { TABLECONTENT_FRAGMENT } from "../../../graphql/WorkflowDataFetcher/WorkflowsTable/TableContentFragment";
import { TableContentFragment } from "../../../graphql/WorkflowDataFetcher/WorkflowsTable/__generated__/TableContentFragment.generated";

interface TableContentProps {
  queryData: TableContentFragment;
  currentPage: number;
  setCurrentPage: (newPage: number) => void;
  selectedLimit: number;
  setSelectedLimit: (newLimit: number) => void;
  selectedWorkflow: string | null;
  setSelectedWorkflow: (_: string | null) => void;
  updatePageInfo: (hasNextPage: boolean, endCursor: string | null) => void;
  onPageChange: (
    page: number,
    endCursor?: string | null,
    hasNextPage?: boolean
  ) => void;
}

interface TablePaginationActionProps {
  page: number;
  onPageChange: (event: MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

const TableContent = ({
  queryData,
  currentPage,
  setCurrentPage,
  selectedLimit,
  setSelectedLimit,
  selectedWorkflow,
  setSelectedWorkflow,
  updatePageInfo,
  onPageChange,
}: TableContentProps) => {
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

  const fetchedWorkflows = data.nodes;

  const handlePageChange = (_: unknown, newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedLimit(parseInt(event.target.value));
  };

  const TablePaginationActions = ({
    page,
    onPageChange: onPaginationPageChange,
  }: TablePaginationActionProps) => {
    const handlePrevPageButtonClick = (
      event: MouseEvent<HTMLButtonElement>
    ) => {
      onPaginationPageChange(event, page - 1);
      onPageChange(page - 1, pageInfo?.endCursor, pageInfo?.hasNextPage);
    };
    const handleNextPageButtonClick = (
      event: MouseEvent<HTMLButtonElement>
    ) => {
      onPaginationPageChange(event, page + 1);
      onPageChange(page + 1, pageInfo?.endCursor, pageInfo?.hasNextPage);
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
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="left"></TableCell>
              <TableCell align="left">ID</TableCell>
              <TableCell align="left">Scan Number</TableCell>
              <TableCell align="left">Status</TableCell>
              <TableCell align="left">Progress</TableCell>
              <TableCell align="left">Controls</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fetchedWorkflows?.map((workflow) => (
              <TableRowWrapper
                key={workflow.name}
                queryData={workflow}
                selectedWorkflow={selectedWorkflow}
                setSelectedWorkflow={setSelectedWorkflow}
              />
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
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
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );
};

export default TableContent;
