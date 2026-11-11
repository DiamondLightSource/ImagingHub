/*
  Derived from: https://github.com/DiamondLightSource/xrpddatavis
  This version adds support for infinite scroll and virtualisation
*/

import { useRef, useState } from "react";
import {
  ScanSelectorTable,
  type RowSelectionState,
  SortDirection,
} from "./ScanSelectorTable";
import { ScanSelectorHeader } from "./ScanSelectorHeader";
import { InfScrollFooter } from "./ScanSelectorFooter";
import { Box } from "@mui/material";
import { useQuery } from "@apollo/client/react";
import { INSTRUMENTSESSION_QUERY } from "../../graphql/InstrumentSessionQuery";
import { DatasetFilterInput } from "../../../../src/__generated__/types";
import { ScanDateRange, ScanNodeProcessed } from "../../types";
import { getBeamlineConfig } from "../../beamline.config";

export function formatDate(date: Date | null | undefined) {
  if (date) {
    console.log("date", date);
    return date.toLocaleString(undefined, { timeZone: "UTC" });
  }
  return "No date";
}

type ScanSelectorProps = {
  sessionRef: string;
  setSelectedScans: (v: ScanNodeProcessed[]) => void;
};
export const ScanSelector = ({
  sessionRef,
  setSelectedScans,
}: ScanSelectorProps) => {
  const [selectedInf, setSelectedInf] = useState<RowSelectionState>({});
  const previousRow = useRef<number | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [sortDirection, setSortDirection] = useState<SortDirection>("newest");
  const [searchString, setSearchString] = useState<string | null>(null);
  const [totalLoaded, setTotalLoaded] = useState(0);
  const [loadMore, setLoadMore] = useState(false);

  const [scanDateFilter, setScanDateFilter] = useState<ScanDateRange>({});

  console.log("sessionRef", sessionRef);

  const { data } = useQuery(INSTRUMENTSESSION_QUERY, {
    variables: {
      reference: sessionRef,
      first: 1,
    },
  });

  const schema =
    data?.instrumentSessionByReference?.datasets?.edges?.[0]?.node?.dataSchema;

  const sessionStartTime = data?.instrumentSessionByReference?.startTime as
    string | undefined;
  const sessionEndTime = data?.instrumentSessionByReference?.endTime as
    string | undefined;

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
        startDate={sessionStartTime ? new Date(sessionStartTime) : null}
        endDate={sessionEndTime ? new Date(sessionEndTime) : null}
        dateRangeFilter={scanDateFilter}
        setDateRangeFilter={setScanDateFilter}
      />
      <Box
        sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}
      >
        <ScanSelectorTable
          sessionRef={sessionRef}
          setTotalCount={setTotalCount}
          sortDirection={sortDirection}
          setLoadMore={setLoadMore}
          setTotalLoaded={setTotalLoaded}
          filter={filter}
          setSelectedScans={setSelectedScans}
          onClick={(e, prev, idx, row, checkboxClick, data) => {
            const newState = { ...prev };

            console.log("e.shiftKey ", e.shiftKey, previousRow.current, idx);

            if (e.shiftKey && previousRow.current != null) {
              if (previousRow.current < idx) {
                for (let i = previousRow.current; i <= idx; i++) {
                  newState[i] = true;
                }
                // or the opposite
              } else {
                for (let i = idx; i <= previousRow.current; i++) {
                  newState[i] = true;
                }
              }
              console.log("newState ", newState);
              return newState;
            } else if (e.ctrlKey || checkboxClick) {
              return {
                ...prev,
                [idx]: !prev[idx], // Enable multi-select if ctrl key is held down
              };
            } else {
              previousRow.current = idx;
              return {
                [idx]: !prev[idx],
              };
            }
          }}
          rowSelection={selectedInf}
          onRowSelectionChange={setSelectedInf}
        />
      </Box>

      <InfScrollFooter
        totalCount={totalCount}
        totalLoaded={totalLoaded}
        loadMore={loadMore}
      />
    </>
  );
};
