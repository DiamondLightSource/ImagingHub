/*
  Derived from: https://github.com/DiamondLightSource/xrpddatavis
  This version adds support for infinite scroll and virtualisation
*/

import { useEffect, useRef, useState } from "react";
import {
  ScanSelectorTable,
  type RowSelectionState,
  SortDirection,
} from "./ScanSelectorTable";
import { ScanSelectorHeader } from "./ScanSelectorHeader";
import { ScanSelectorFooter } from "./ScanSelectorFooter";
import { Box } from "@mui/material";
import { useQuery } from "@apollo/client/react";
import { INSTRUMENTSESSION_QUERY } from "../../graphql/InstrumentSessionQuery";
import { DatasetFilterInput } from "../../../../src/__generated__/types";
import { ScanDateRange, ScanNodeProcessed, SelectedScans } from "../../types";
import { getBeamlineConfig } from "../../beamline.config";

function multiSelect(
  data: ScanNodeProcessed[],
  startId: number,
  endId: number,
  rowSelectionState: RowSelectionState
): RowSelectionState {
  const newSelectionState = { ...rowSelectionState };

  const startIdx = data.findIndex((x) => x.id === startId);
  let endIdx = startIdx;
  while (data[endIdx].id !== endId) {
    newSelectionState[data[endIdx].id] = true;
    endIdx++;
  }
  newSelectionState[data[endIdx].id] = true;
  return newSelectionState;
}

type ScanSelectorProps = {
  sessionRef: string;
  setSelectedScans: (v: SelectedScans) => void;
};
export const ScanSelector = ({
  sessionRef,
  setSelectedScans,
}: ScanSelectorProps) => {
  const [selectedInf, setSelectedInf] = useState<RowSelectionState>({});
  const previousRow = useRef<{ id: number; idx: number } | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<string | null>(null);
  const [sessionEndTime, setSessionEndTime] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("newest");
  const [searchString, setSearchString] = useState<string | null>(null);
  const [totalLoaded, setTotalLoaded] = useState(0);
  const [loadMore, setLoadMore] = useState(false);

  const [scanDateFilter, setScanDateFilter] = useState<ScanDateRange>({});

  const { data } = useQuery(INSTRUMENTSESSION_QUERY, {
    variables: {
      reference: sessionRef,
      first: 1,
    },
    fetchPolicy: "no-cache",
    skip:
      totalCount !== null &&
      sessionStartTime !== null &&
      sessionEndTime !== null,
  });

  // Persist the total count, session start/end times across renders
  useEffect(() => {
    setTotalCount(
      data?.instrumentSessionByReference?.datasets?.totalCount ?? null
    );
    setSessionStartTime(
      (data?.instrumentSessionByReference?.startTime ?? null) as string | null
    );
    setSessionEndTime(
      (data?.instrumentSessionByReference?.endTime ?? null) as string | null
    );
  }, [data]);

  // Reset the total count, session start/end times when the sessionRef changes
  useEffect(() => {
    setTotalCount(null);
    setSessionStartTime(null);
    setSessionEndTime(null);
  }, [sessionRef]);

  const schema =
    data?.instrumentSessionByReference?.datasets?.edges?.[0]?.node?.dataSchema;

  const beamlineConfig = schema ? getBeamlineConfig(schema) : null;
  const startTimePath = beamlineConfig?.startTimePath;

  const filter: DatasetFilterInput | undefined =
    searchString ||
    (startTimePath && scanDateFilter?.start && scanDateFilter?.end)
      ? {
          title: {
            contains: searchString,
          },
          data: startTimePath
            ? [
                {
                  operator: {
                    datetimeOperator: {
                      // toISOString() will always return a timestamp ending in 'Z':
                      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format
                      // We need to remove the 'Z' to query the graph
                      gt:
                        scanDateFilter?.start?.toISOString().replace("Z", "") ??
                        null,
                      lt:
                        scanDateFilter?.end?.toISOString().replace("Z", "") ??
                        null,
                    },
                  },
                  path: startTimePath,
                },
              ]
            : undefined,
        }
      : undefined;

  return (
    <>
      <ScanSelectorHeader
        rowSelection={selectedInf}
        totalCount={totalCount}
        setSortDirection={setSortDirection}
        sortDirection={sortDirection}
        searchString={searchString}
        setSearchString={setSearchString}
        // Session start/end times don't come with a time zone
        // Add 'Z' to set it to UTC
        startDate={sessionStartTime ? new Date(sessionStartTime + "Z") : null}
        endDate={sessionEndTime ? new Date(sessionEndTime + "Z") : null}
        dateRangeFilter={scanDateFilter}
        setDateRangeFilter={setScanDateFilter}
      />
      <Box
        sx={{
          flex: 1,
          minHeight: 100,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ScanSelectorTable
          sessionRef={sessionRef}
          sortDirection={sortDirection}
          setLoadMore={setLoadMore}
          setTotalLoaded={setTotalLoaded}
          filter={filter}
          setSelectedScans={setSelectedScans}
          onClick={(e, prev, idx, row, checkboxClick, data) => {
            if (e.shiftKey && previousRow.current != null) {
              if (previousRow.current.idx < idx) {
                // Go 'up' in index (i.e. top to bottom)
                return multiSelect(data, previousRow.current.id, row.id, prev);
              } else {
                return multiSelect(data, row.id, previousRow.current.id, prev);
              }
            } else if (e.ctrlKey || checkboxClick) {
              previousRow.current = { id: row.id, idx: idx };
              return {
                ...prev,
                [row.id]: !prev[row.id], // Enable multi-select if ctrl key is held down
              };
            } else {
              previousRow.current = { id: row.id, idx: idx };
              return {
                [row.id]: !prev[row.id],
              };
            }
          }}
          rowSelection={selectedInf}
          onRowSelectionChange={setSelectedInf}
        />
      </Box>

      <ScanSelectorFooter
        totalCount={totalCount}
        totalLoaded={totalLoaded}
        loadMore={loadMore}
      />
    </>
  );
};
