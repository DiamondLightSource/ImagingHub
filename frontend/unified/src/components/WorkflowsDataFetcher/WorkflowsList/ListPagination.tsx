import { Pagination } from "@mui/material";

const ListPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (
    page: number,
    endCursor?: string | null,
    hasNextPage?: boolean
  ) => void;
}) => {
  return (
    <>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(_, page) => onPageChange(page)}
        showFirstButton
        siblingCount={1}
        boundaryCount={0}
      />
    </>
  );
};

export default ListPagination;
