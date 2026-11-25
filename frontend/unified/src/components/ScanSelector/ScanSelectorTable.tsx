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
import React, { forwardRef, useEffect, useRef } from "react";
import { TableVirtuoso, type TableComponents } from "react-virtuoso";
import { Progress } from "@diamondlightsource/sci-react-ui";
import { INSTRUMENTSESSION_QUERY } from "../../graphql/InstrumentSessionQuery";
import { PageInfo, ScanNodeProcessed, SelectedScans } from "../../types";
import { DatasetFilterInput } from "../../../../src/__generated__/types";
import {
  getBeamlineConfig,
  getFieldString,
  getFieldValue,
  getProcessedData,
  SchemaConfig,
} from "../../beamline.config";
import { SortDirection, RowSelectionState } from "./types";

const FIRST_LINE = 28;
const SELECTED_SHADOW =
  "inset 3px 0 0 var(--ds-primary), inset 0 0 0 9999px var(--ds-overlay-selected)";

type ScanCardProps = {
  data: ScanNodeProcessed;
  config: SchemaConfig | null;
  isSelected: boolean;
  onRowClick: (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    checkboxEvent: boolean
  ) => void;
};

/**
 * Card component for scan selector. A selectable component that displays information about a single scan
 *
 * @param {ScanCardProps} props - ScanCard props
 * @param {ScanNodeProcessed} props.data - Data for a single scan
 * @param {SchemaConfig | null} props.config - Schema config for this scan
 * @param {boolean} props.isSelected - Is the current card selected?
 * @param {(
 *  e: React.MouseEvent<HTMLElement, MouseEvent>,
 *  checkboxEvent: boolean
 * ) => void} props.onRowClick - Callback for when the card/checkbox is clicked
 * @returns {React.JSX.Element} ScanCard component
 */
export const ScanCard = ({
  data,
  config,
  isSelected,
  onRowClick,
}: ScanCardProps): React.JSX.Element => {
  const scanSelectorUi = config?.ui?.scanSelector;
  const title = getFieldString(config, data, scanSelectorUi?.title);
  const item1 = getFieldString(config, data, scanSelectorUi?.item1);
  const item2 = getFieldString(config, data, scanSelectorUi?.item2);
  const item3 = getFieldString(config, data, scanSelectorUi?.item3);

  return (
    <Box
      data-plot-id={title}
      onClick={(e) => {
        onRowClick(e, false);
      }}
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
          onRowClick(e, true);
        }}
        inputProps={{ "aria-label": `Show ${title}` }}
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
            {title}
          </Typography>
        </Stack>
        <Typography
          variant="meta"
          component="div"
          noWrap
          sx={{ color: "text.secondary", minHeight: "1.5em" }}
        >
          {item1}
        </Typography>
        <Typography
          variant="meta"
          component="div"
          noWrap
          sx={{ color: "text.secondary", minWidth: 0 }}
          overflow="none"
        >
          {item2} {item3 ? " · " + item3 : ""}
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

type ScanSelectorTableProps<T> = {
  sessionRef: string;
  onClick: (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    prev: RowSelectionState,
    index: number,
    row: T,
    checkboxClick: boolean,
    data: ScanNodeProcessed[]
  ) => RowSelectionState;
  rowSelection: RowSelectionState;
  onRowSelectionChange: (v: RowSelectionState) => void;
  sortDirection: SortDirection;
  setLoadMore: (v: boolean) => void;
  setTotalLoaded: (v: number) => void;
  setSelectedScans: (v: SelectedScans) => void;
  filter?: DatasetFilterInput | null;
};

/**
 * Scan selector table. Displays all scans for a session in a list.
 *
 * @param {ScanSelectorTableProps<ScanNodeProcessed>} props - Scan selector table props
 * @param {string} props.sessionRef - Session reference for the current session
 * @param {(
 *  event: React.MouseEvent<HTMLElement, MouseEvent>,   Click event
 *  prev: RowSelectionState,                            Current row selection state
 *  index: number,                                      Index of currently selected row
 *  row: ScanNodeProcessed,                             Data corresponding to the row selected
 *  checkboxClick: boolean,                             True if MouseEvent event was triggered by the checkbox
 *  data: ScanNodeProcessed[]                           All data loaded into the table
 * ) => RowSelectionState} param0.onClick - Callback for when a row is clicked.
 * @param {RowSelectionState} props.rowSelection - Current row selection state
 * @param {(v: RowSelectionState) => void} props.onRowSelectionChange - Callback for when the row selection state is changed
 * @param {SortDirection} props.sortDirection - Current sort direction
 * @param {(v: boolean) => void} props.setLoadMore - Set whether more data is currently being loaded
 * @param {(v: number) => void} props.setTotalLoaded - Set the total number of scans loaded
 * @param {(v: SelectedScans) => void} props.setSelectedScans - Callback for when the selected scans has changed
 * @param {DatasetFilterInput | null} props.filter - Graph query filter to use
 * @returns {React.JSX.Element} - Scan selector table componenet
 */
export const ScanSelectorTable = ({
  sessionRef,
  onClick,
  rowSelection,
  onRowSelectionChange,
  sortDirection,
  setLoadMore,
  setTotalLoaded,
  setSelectedScans,
  filter,
}: ScanSelectorTableProps<ScanNodeProcessed>): React.JSX.Element => {
  const descPage = useRef<PageInfo | null>(null);
  const ascPage = useRef<PageInfo | null>(null);

  const getSelectedScans = (
    data: ScanNodeProcessed[],
    rowSelection: RowSelectionState
  ): ScanNodeProcessed[] => {
    return data.filter(
      (x) => Object.keys(rowSelection).includes(`${x.id}`) && rowSelection[x.id]
    );
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
      descPage.current =
        data?.instrumentSessionByReference?.datasets.pageInfo ?? null;
    } else {
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

  const config = getBeamlineConfig(
    data?.instrumentSessionByReference?.datasets?.edges?.[0]?.node?.dataSchema
  );
  const processedNodes = data ? getProcessedData(data) : [];

  const scanNumbersSorted = processedNodes.sort((a, b) => {
    if (!config) {
      return 0;
    }
    const coeff = isDescSort(sortDirection) ? 1 : -1;
    const aStart = getFieldValue(config, a, "startTime") as Date;
    const bStart = getFieldValue(config, b, "startTime") as Date;
    if (bStart && aStart) {
      return coeff * (bStart.getTime() - aStart.getTime());
    }
    return 0;
  });

  useEffect(() => {
    setLoadMore(loading && scanNumbersSorted.length > 0);
  }, [loading]);

  useEffect(() => {
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
      itemContent={(index: number, row: ScanNodeProcessed) => {
        return (
          <TableCell
            key="scans"
            padding="none"
            sx={{
              borderBottom: "none",
            }}
          >
            <ScanCard
              data={row}
              config={config}
              isSelected={rowSelection[row.id] ?? false}
              onRowClick={(e, checkboxEvent) => {
                const rowSelectionState = onClick(
                  e,
                  rowSelection,
                  index,
                  row,
                  checkboxEvent,
                  scanNumbersSorted
                );
                onRowSelectionChange(rowSelectionState);
                setSelectedScans({
                  config: config,
                  scans: getSelectedScans(scanNumbersSorted, rowSelectionState),
                });
              }}
            />
          </TableCell>
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
