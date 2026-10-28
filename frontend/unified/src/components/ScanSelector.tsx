import { Typography, Box } from "@mui/material";
import {
  useMaterialReactTable,
  type MRT_TableInstance,
  createMRTColumnHelper,
  type MRT_RowSelectionState,
  MaterialReactTable,
  type MRT_Row,
  type MRT_SortingState,
} from "material-react-table";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@apollo/client/react";

import type { ScanNodeProcessed, PageInfo } from "../types";
import { INSTRUMENTSESSION_QUERY } from "../graphql/InstrumentSessionQuery";
import { getProcessedScanNode } from "../beamline.config";

export function formatDate(date: Date | null) {
  if (date) {
    return date.toLocaleString(undefined, { timeZone: "UTC" });
  }
  return "No date";
}

// Derived from infinite scroll example:
// https://www.material-react-table.com/docs/examples/infinite-scrolling

const columnHelper = createMRTColumnHelper<ScanNodeProcessed>();
const columns = [
  columnHelper.accessor("scanNumber", {
    header: "Scans",
    size: 120,
    filterVariant: "text",
    Cell: ({ row }) => (
      <Box>
        <Typography variant="body2">{row.original.scanNumber}</Typography>
        <Typography variant="caption" color="text.muted">
          {formatDate(row.original.startTime)}
        </Typography>
      </Box>
    ),
  }),
];

type ScanSelectorProp = {
  sessionRef: string;
  onScanSelect: (scans: ScanNodeProcessed[]) => void;
};
export function ScanSelector({ sessionRef, onScanSelect }: ScanSelectorProp) {
  const tableContainerRef = useRef<HTMLDivElement>(null); //we can get access to the underlying TableContainer element and react to its scroll events

  const FETCH_SIZE = 30;

  const descPage = useRef<PageInfo | null>(null);
  const ascPage = useRef<PageInfo | null>(null);
  const sortingChanged = useRef(false);
  const prevDesc = useRef(false);

  const [sorting, setSorting] = useState<MRT_SortingState>([]);

  const isDescSort = (x: MRT_SortingState) => {
    let desc = true;
    if (x.length > 0 && x[0].id == "scanNumber") {
      desc = x[0].desc;
    }
    return desc;
  };

  const { data, loading, fetchMore, client } = useQuery(
    INSTRUMENTSESSION_QUERY,
    {
      variables: {
        reference: sessionRef,
        first: isDescSort(sorting) ? FETCH_SIZE : null,
        last: !isDescSort(sorting) ? FETCH_SIZE : null,
        after: null,
        before: null,
      },
    }
  );

  useEffect(() => {
    if (isDescSort(sorting)) {
      descPage.current =
        data?.instrumentSessionByReference?.datasets.pageInfo ?? null;
    } else {
      ascPage.current =
        data?.instrumentSessionByReference?.datasets.pageInfo ?? null;
    }
  }, [data, sorting]);

  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        //once the user has scrolled within 400px of the bottom of the table, fetch more data if we can

        if (
          scrollHeight - scrollTop - clientHeight < 400 &&
          !loading &&
          ((isDescSort(sorting) && descPage.current?.hasNextPage) ||
            (!isDescSort(sorting) && ascPage.current?.hasPreviousPage))
        ) {
          fetchMore({
            variables: {
              reference: sessionRef,
              first: isDescSort(sorting) ? FETCH_SIZE : null,
              last: !isDescSort(sorting) ? FETCH_SIZE : null,
              after: isDescSort(sorting)
                ? (descPage.current?.endCursor ?? null)
                : null,
              before: !isDescSort(sorting)
                ? (ascPage.current?.startCursor ?? null)
                : null,
            },
          });
        }
      }
    },
    [loading, fetchMore, sessionRef, sorting]
  );

  let parsedNodes: ScanNodeProcessed[] = [];
  if (data && data.instrumentSessionByReference) {
    parsedNodes = getProcessedScanNode(data);
  }

  const scanNumbersSorted = parsedNodes.sort((a, b) => {
    const coeff = isDescSort(sorting) ? 1 : -1;
    if (b.startTime && a.startTime) {
      return coeff * (b.startTime.getTime() - a.startTime.getTime());
    }
    return 0;
  });

  const previousRow = useRef<MRT_Row<ScanNodeProcessed> | null>(null);

  const table: MRT_TableInstance<ScanNodeProcessed> = useMaterialReactTable({
    columns: columns,
    data: scanNumbersSorted,
    enableKeyboardShortcuts: false,
    enableColumnActions: false,
    enableColumnFilters: true,
    enablePagination: false,
    manualSorting: true,
    manualFiltering: true,
    enableRowSelection: false,
    enableMultiRowSelection: false,
    enableBottomToolbar: false,
    enableTopToolbar: false,
    initialState: {
      density: "compact",
    },

    muiTableBodyRowProps: ({ row }) => ({
      //implement row selection click events manually
      onClick: (e) => {
        setRowSelection((prev) => {
          // Shift + click selection
          // https://stackoverflow.com/a/56178061
          const newState = { ...prev };

          if (e.shiftKey && previousRow.current) {
            if (previousRow.current.index < row.index) {
              for (let i = previousRow.current.index; i <= row.index; i++) {
                newState[i] = true;
              }
            } else {
              for (let i = row.index; i <= previousRow.current.index; i++) {
                newState[i] = true;
              }
            }
            return newState;
          } else if (e.ctrlKey) {
            return {
              ...prev,
              [row.id]: !prev[row.id], // Enable multi-select if ctrl key is held down
            };
          } else {
            previousRow.current = row;
            return {
              [row.id]: !prev[row.id],
            };
          }
        });
      },
      selected: rowSelection[row.id],
      sx: {
        cursor: "pointer",
      },
    }),
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    state: {
      rowSelection,
      sorting,
    },
    enableRowVirtualization: true,
    muiTableContainerProps: {
      ref: tableContainerRef, //get access to the table container element
      sx: {
        maxHeight: "100%",
      }, //give the table a max height
      onScroll: (event: React.UIEvent<HTMLDivElement>) =>
        fetchMoreOnBottomReached(event.target as HTMLDivElement), //add an event listener to the table container element
    },
  });

  // useEffect to perform an action when the selection state changes:
  // https://www.material-react-table.com/docs/guides/row-selection#read-row-selection-state-from-table-instance
  useEffect(() => {
    // Get session reference of selected row
    const selectedIdx = Object.keys(table.getState().rowSelection);
    // console.log("selected ", selectedIdx);

    const selectedData = selectedIdx
      .filter((x) => rowSelection[x])
      .map((x) => table.getRow(x).original);
    onScanSelect(selectedData);

    // `onScanSelect` should not be placed into dependency list as it causes an infinite loop
  }, [table.getState().rowSelection]);

  useEffect(() => {
    const pageData = isDescSort(sorting) ? descPage.current : ascPage.current;

    // Only fetch when the sort order has actually changed
    if (prevDesc.current !== isDescSort(sorting)) {
      client.resetStore();
      fetchMore({
        variables: {
          reference: sessionRef,
          first: isDescSort(sorting) ? FETCH_SIZE : null,
          last: !isDescSort(sorting) ? FETCH_SIZE : null,
          after: isDescSort(sorting) ? (pageData?.endCursor ?? null) : null,
          before: !isDescSort(sorting) ? (pageData?.startCursor ?? null) : null,
        },
      });
    }

    sortingChanged.current = true;
    prevDesc.current = isDescSort(sorting);
  }, [sorting, client, fetchMore, sessionRef]);

  return <MaterialReactTable table={table} />;
}
