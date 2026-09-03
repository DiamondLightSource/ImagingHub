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
import { TableContentFragmentFragment } from "./__generated__/TableContent.generated";
import { ChangeEvent, MouseEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { gql, TypedDocumentNode } from "@apollo/client";
import TableRowRelay, { TABLEROWRELAY_FRAGMENT } from "./TableRowRelay";

export const TABLECONTENT_FRAGMENT: TypedDocumentNode<TableContentFragmentFragment> = gql`
  fragment TableContentFragment on WorkflowConnection {
    pageInfo {
      hasNextPage
      startCursor
      endCursor
    }
    nodes {
      ...TableRowRelayFragment @unmask
    }
  }
  ${TABLEROWRELAY_FRAGMENT}
`;

interface TableContentProps {
  queryData: TableContentFragmentFragment;
  currentPage: number;
  setCurrentPage: (newPage: number) => void;
  selectedLimit: number;
  setSelectedLimit: (newLimit: number) => void;
  setCursor: (newCursor: string | null) => void;
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
  setCursor,
}: TableContentProps) => {
  const { complete, data } = useFragment({
    fragment: TABLECONTENT_FRAGMENT,
    fragmentName: "TableContentFragment",
    from: queryData,
  });

  if (!complete) return <div>Not Complete</div>;
  if (!data) return <div>No Data</div>;

  const pageInfo = data.pageInfo;
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
      setCursor(pageInfo.startCursor);
    };
    const handleNextPageButtonClick = (
      event: MouseEvent<HTMLButtonElement>
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
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="left">ID</TableCell>
              <TableCell align="left">Scan Number</TableCell>
              <TableCell align="left">Status</TableCell>
              <TableCell align="left">Progress</TableCell>
              <TableCell align="left">Controls</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fetchedWorkflows?.map((workflow) => (
              <TableRowRelay queryData={workflow} />
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
