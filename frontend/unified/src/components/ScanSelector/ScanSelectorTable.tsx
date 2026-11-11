import { useQuery } from "@apollo/client/react";
import {
  Box,
  Checkbox,
  Stack,
  TableBody,
  TableContainer,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
} from "@mui/material";
import { forwardRef, Fragment, useEffect, useRef } from "react";
import { TableVirtuoso, type TableComponents } from "react-virtuoso";
import { Progress } from "@diamondlightsource/sci-react-ui";
import { INSTRUMENTSESSION_QUERY } from "../../graphql/InstrumentSessionQuery";
import { PageInfo, ScanNodeProcessed } from "../../types";
import { getProcessedScanNode } from "../../beamline.config";
import { DatasetFilterInput } from "../../../../src/__generated__/types";
import { formatDate } from "./ScanSelector";

const FIRST_LINE = 28;
const SELECTED_SHADOW =
  "inset 3px 0 0 var(--ds-primary), inset 0 0 0 9999px var(--ds-overlay-selected)";

const SortDirection = {
  NEWEST: "newest",
  OLDEST: "oldest",
} as const;
type SortDirection = (typeof SortDirection)[keyof typeof SortDirection];
export { SortDirection };

export interface SortOption {
  value: SortDirection;
  label: string;
}
export const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
] as const satisfies readonly SortOption[];

type ListItemProps = {
  data: ScanNodeProcessed;
  isSelected: boolean;
  onCheckboxSelect: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
};
export const ListItem = ({
  data,
  isSelected,
  onCheckboxSelect,
}: ListItemProps) => {
  // const [isSelected, setIsSelected] = useState(false);

  console.log(data.scanNumber, "isSelected", isSelected);
  return (
    <Box
      component="li"
      data-plot-id={data.scanNumber}
      // onClick={() => {setIsSelected(!isSelected)}}
      sx={{
        display: "flex",
        alignItems: "flex-start",
        flexShrink: 0,
        gap: 0.5,
        listStyle: "none",
        overflow: "hidden",
        cursor: "pointer",
        px: 1,
        pt: 0.5,
        pb: 0.5,
        borderBottom: 1,
        borderColor: "border.subtle",
        backgroundColor: "background.paper",
        boxShadow: isSelected ? SELECTED_SHADOW : "none",
        "&:hover": {
          boxShadow: isSelected
            ? SELECTED_SHADOW
            : "inset 0 0 0 9999px var(--ds-overlay-hover)",
        },
      }}
    >
      <Checkbox
        size="small"
        sx={{ p: 0.5 }}
        checked={isSelected}
        onClick={(e) => {
          e.stopPropagation();
          onCheckboxSelect(e);
        }}
        // onChange={(e) => {setIsSelected(!isSelected)}}
        inputProps={{ "aria-label": `Show ${data.scanNumber}` }}
      />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Stack
          direction="row"
          alignItems="center"
          sx={{ minHeight: FIRST_LINE }}
        >
          <Typography
            variant="body2"
            fontWeight={500}
            noWrap
            sx={{ minWidth: 0, flex: 1 }}
          >
            {data.scanNumber}
          </Typography>
        </Stack>
        <Typography
          variant="meta"
          component="div"
          noWrap
          sx={{ color: "text.secondary", minHeight: "1.5em" }}
        >
          {formatDate(data.startTime)}
        </Typography>
        <Typography
          variant="meta"
          component="div"
          noWrap
          sx={{ color: "text.muted", minWidth: 0 }}
        >
          Sample name · XRF
        </Typography>
      </Box>
    </Box>
  );
};

const VirtuosoTableComponents: TableComponents<ScanNodeProcessed> = {
  Scroller: forwardRef<HTMLDivElement>((props, ref) => (
    <TableContainer
      component={Paper}
      sx={{ borderRadius: 0, borderWidth: 0 }}
      {...props}
      ref={ref}
    />
  )),
  Table: (props) => (
    <Table
      {...props}
      sx={{ borderCollapse: "separate", tableLayout: "fixed" }}
    />
  ),
  TableHead: forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableHead {...props} ref={ref} />
  )),
  TableRow,
  TableBody: forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
};

const columns = [
  {
    width: 100,
    label: "Scan",
    dataKey: "scan",
  },
];

export type RowSelectionState = { [key: number]: boolean };

type ScanSelectorTableProps<T> = {
  sessionRef: string;
  onClick: (
    event: React.MouseEvent<HTMLTableCellElement, MouseEvent>,
    prev: RowSelectionState,
    index: number,
    row: T,
    checkboxClick: boolean,
    data: ScanNodeProcessed[]
  ) => RowSelectionState;
  rowSelection: RowSelectionState;
  onRowSelectionChange: (v: RowSelectionState) => void;
  setTotalCount: (v: number) => void;
  sortDirection: SortDirection;
  setLoadMore: (v: boolean) => void;
  setTotalLoaded: (v: number) => void;
  setSelectedScans: (v: ScanNodeProcessed[]) => void;
  filter?: DatasetFilterInput | null;
};
export const ScanSelectorTable = ({
  sessionRef,
  onClick,
  rowSelection,
  onRowSelectionChange,
  setTotalCount,
  sortDirection,
  setLoadMore,
  setTotalLoaded,
  setSelectedScans,
  filter,
}: ScanSelectorTableProps<ScanNodeProcessed>) => {
  const descPage = useRef<PageInfo | null>(null);
  const ascPage = useRef<PageInfo | null>(null);

  const getSelectedScans = (
    data: ScanNodeProcessed[],
    rowSelection: RowSelectionState
  ): ScanNodeProcessed[] => {
    return Object.keys(rowSelection)
      .filter((idx) => rowSelection[Number(idx)])
      .map((idx) => data[Number(idx)]);
  };

  const isDescSort = (v: SortDirection) => v === SortDirection.NEWEST;
  const FETCH_SIZE = 30;

  const { data, loading, fetchMore, client } = useQuery(
    INSTRUMENTSESSION_QUERY,
    {
      variables: {
        reference: sessionRef,
        first: isDescSort(sortDirection) ? FETCH_SIZE : null,
        last: !isDescSort(sortDirection) ? FETCH_SIZE : null,
        after: null,
        before: null,
        filter: filter,
      },
    }
  );

  useEffect(() => {
    if (isDescSort(sortDirection)) {
      console.log("assign descPage");
      descPage.current =
        data?.instrumentSessionByReference?.datasets.pageInfo ?? null;
    } else {
      console.log("assign ascPage");
      ascPage.current =
        data?.instrumentSessionByReference?.datasets.pageInfo ?? null;
    }
  }, [data]);

  useEffect(() => {
    const pageData = isDescSort(sortDirection)
      ? descPage.current
      : ascPage.current;
    client.resetStore();
    fetchMore({
      variables: {
        reference: sessionRef,
        first: isDescSort(sortDirection) ? FETCH_SIZE : null,
        last: !isDescSort(sortDirection) ? FETCH_SIZE : null,
        after: isDescSort(sortDirection) ? (pageData?.endCursor ?? null) : null,
        before: !isDescSort(sortDirection)
          ? (pageData?.startCursor ?? null)
          : null,
      },
    });
  }, [sortDirection]);

  const processedNodes = data ? getProcessedScanNode(data) : [];

  const scanNumbersSorted = processedNodes.sort((a, b) => {
    const coeff = isDescSort(sortDirection) ? 1 : -1;
    if (b.startTime && a.startTime) {
      return coeff * (b.startTime.getTime() - a.startTime.getTime());
    }
    return 0;
  });

  useEffect(() => {
    setLoadMore(loading && scanNumbersSorted.length > 0);
  }, [loading]);

  useEffect(() => {
    setTotalCount(
      data?.instrumentSessionByReference?.datasets?.totalCount ?? 0
    );
    setTotalLoaded(scanNumbersSorted.length);
  }, [data]);

  if (scanNumbersSorted.length === 0 && loading && sessionRef !== "") {
    return (
      <Stack
        spacing={1}
        justifyContent="center"
        alignContent="center"
        alignItems="center"
        sx={{ p: 4, color: "text.secondary" }}
      >
        <Typography variant="body2">Loading...</Typography>
        <Progress />
      </Stack>
    );
  } else if (scanNumbersSorted.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: "center", color: "text.secondary" }}>
        <Typography variant="body2">No data loaded.</Typography>
      </Box>
    );
  }

  return (
    <TableVirtuoso
      data={scanNumbersSorted}
      components={VirtuosoTableComponents}
      atBottomThreshold={20}
      itemContent={(index, row) => {
        return (
          <Fragment>
            {columns.map((column) => (
              <TableCell
                key={column.dataKey}
                padding="none"
                sx={{
                  borderBottom: "none",
                }}
                onClick={(e) => {
                  const rowSelectionState = onClick(
                    e,
                    rowSelection,
                    index,
                    row,
                    false,
                    scanNumbersSorted
                  );
                  console.log("rowSelectionState", rowSelectionState);
                  onRowSelectionChange(rowSelectionState);
                  setSelectedScans(
                    getSelectedScans(scanNumbersSorted, rowSelectionState)
                  );
                }}
              >
                <ListItem
                  data={row}
                  isSelected={rowSelection[index] ?? false}
                  onCheckboxSelect={(e) => {
                    const rowSelectionState = onClick(
                      e,
                      rowSelection,
                      index,
                      row,
                      true,
                      scanNumbersSorted
                    );
                    onRowSelectionChange(rowSelectionState);
                    setSelectedScans(
                      getSelectedScans(scanNumbersSorted, rowSelectionState)
                    );
                  }}
                />
              </TableCell>
            ))}
          </Fragment>
        );
      }}
      endReached={() => {
        if (
          !loading &&
          ((isDescSort(sortDirection) && descPage.current?.hasNextPage) ||
            (!isDescSort(sortDirection) && ascPage.current?.hasPreviousPage))
        ) {
          fetchMore({
            variables: {
              reference: sessionRef,
              first: isDescSort(sortDirection) ? FETCH_SIZE : null,
              last: !isDescSort(sortDirection) ? FETCH_SIZE : null,
              after: isDescSort(sortDirection)
                ? (descPage.current?.endCursor ?? null)
                : null,
              before: !isDescSort(sortDirection)
                ? (ascPage.current?.startCursor ?? null)
                : null,
            },
          });
        }
      }}
    />
  );
};
