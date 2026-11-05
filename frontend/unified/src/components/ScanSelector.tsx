import { ScanSearch } from "./ScanSearch";
import { ScanDateFilter } from "./ScanDateFilter";
import { ScanSelectorTable } from "./ScanSelectorTable";
import { ScanNodeProcessed, ScanDateRange } from "../types";
import { useState } from "react";
import { DatasetFilterInput } from "../../../src/__generated__/types";
import { getBeamlineConfig, getProcessedScanNode } from "../beamline.config";
import { useQuery } from "@apollo/client/react";
import { INSTRUMENTSESSION_QUERY } from "../graphql/InstrumentSessionQuery";

type ScanSelectorProps = {
  sessionRef: string;
  updateScanData: (v: ScanNodeProcessed[]) => void;
};
export const ScanSelector = ({
  sessionRef,
  updateScanData,
}: ScanSelectorProps) => {
  const [searchScanNumber, setSearchScanNumber] = useState<string | null>(null);
  const [scanDateFilter, setScanDateFilter] = useState<ScanDateRange>({});

  const { data: latestData } = useQuery(INSTRUMENTSESSION_QUERY, {
    variables: {
      reference: sessionRef,
      first: 1,
    },
    fetchPolicy: "no-cache",
  });

  const { data: oldestData } = useQuery(INSTRUMENTSESSION_QUERY, {
    variables: {
      reference: sessionRef,
      last: 1,
    },
    fetchPolicy: "no-cache",
  });

  const schema =
    latestData?.instrumentSessionByReference?.datasets?.edges?.[0]?.node
      ?.dataSchema;
  const latestDataParsed = getProcessedScanNode(latestData)?.[0];
  const oldestDataParsed = getProcessedScanNode(oldestData)?.[0];

  const beamlineConfig = schema ? getBeamlineConfig(schema) : null;
  const startTimePath = beamlineConfig?.startTimePath;

  const filter: DatasetFilterInput | undefined =
    searchScanNumber ||
    (startTimePath && scanDateFilter?.start && scanDateFilter?.end)
      ? {
          title: {
            contains: searchScanNumber,
          },
          data: startTimePath
            ? [
                {
                  operator: {
                    datetimeOperator: {
                      // toISOString() will always return a timestamp ending in 'Z':
                      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format
                      // We need to remove the 'Z' to query the graphAlert
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
      <ScanSearch setSearchScanNumber={setSearchScanNumber} />
      <ScanDateFilter
        sessionRef={sessionRef}
        sessionDateRange={{
          start: oldestDataParsed?.startTime, // Last data returned corresponds to oldest scan
          end: latestDataParsed?.startTime, // First data returned corresponds to latest scan
        }}
        scanDateFilter={scanDateFilter}
        setScanDateFilter={setScanDateFilter}
      />
      <ScanSelectorTable
        updateScanData={updateScanData}
        sessionRef={sessionRef}
        filter={filter}
      />
    </>
  );
};
