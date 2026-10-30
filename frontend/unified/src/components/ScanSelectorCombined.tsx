import { Stack, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { useState } from "react";
import { ScanSelector } from "./ScanSelector";
import { ScanSelector as ScanSelectorLegacy } from "./ScanSelectorLegacy";
import { ScanNodeProcessed } from "../types";

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
        <ScanSelector updateScanData={updateScanData} sessionRef={sessionRef} />
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
