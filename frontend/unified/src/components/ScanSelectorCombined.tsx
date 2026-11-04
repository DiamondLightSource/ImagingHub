import { Stack, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { useState } from "react";
import { ScanSelector } from "./ScanSelector";
import { ScanSelector as ScanSelectorLegacy } from "./ScanSelectorLegacy";
import { ScanNodeProcessed } from "../types";
import { ScanSearch } from "./ScanSearch";
import { DatasetFilterInput } from "../../../src/__generated__/types";

type ScanSelectorCombinedProps = {
  sessionRef: string;
  scanData: ScanNodeProcessed[];
  updateScanData: (v: ScanNodeProcessed[]) => void;
};
export const ScanSelectorCombined = ({
  sessionRef,
  scanData,
  updateScanData,
}: ScanSelectorCombinedProps) => {
  const [selectorType, setSelectorType] = useState("legacy");
  const [searchScanNumber, setSearchScanNumber] = useState<string | null>(null);

  const filter: DatasetFilterInput | null = searchScanNumber
    ? {
        title: {
          contains: searchScanNumber,
        },
      }
    : null;

  return (
    <Stack
      spacing={2}
      sx={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      <ToggleButtonGroup
        value={selectorType}
        onChange={(e, v) => {
          if (v !== null) {
            setSelectorType(v);
          }
        }}
        exclusive
        fullWidth
      >
        <ToggleButton value="new">New</ToggleButton>
        <ToggleButton value="legacy">Legacy</ToggleButton>
      </ToggleButtonGroup>

      {selectorType === "new" ? (
        <>
          <ScanSearch setSearchScanNumber={setSearchScanNumber} />
          <ScanSelector
            updateScanData={updateScanData}
            sessionRef={sessionRef}
            filter={filter}
          />
        </>
      ) : (
        <ScanSelectorLegacy
          scanIds={scanData.map((x) => x.scanNumber)}
          setScanIds={(v) => updateScanData(generateScanData(v))}
        />
      )}
    </Stack>
  );
};

// Generates dummy detailed scan data when using the legacy
// scan selector
const generateScanData = (scanIds: number[]): ScanNodeProcessed[] => {
  return scanIds.map((x) => {
    return {
      __typename: "Dataset",
      scanNumber: x,
      dataSchema: "",
      description: null,
      id: -1,
      title: "Title",
      beamline: null,
      startTime: null,
      endTime: null,
      scanRequest: null,
      data: {},
    };
  });
};
