import { Stack, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { useState } from "react";
import { ScanSelector } from "./ScanSelector";
import { ScanSelector as ScanSelectorLegacy } from "./ScanSelectorLegacy";

type ScanSelectorCombinedProps = {
  sessionRef: string;
  scanIds: number[];
  setScanIds: (v: number[]) => void;
};
export const ScanSelectorCombined = ({
  sessionRef,
  scanIds,
  setScanIds,
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
        <ScanSelector
          onScanSelect={(v) => setScanIds(v.map((x) => x.scanNumber))}
          sessionRef={sessionRef}
        />
      ) : (
        <ScanSelectorLegacy scanIds={scanIds} setScanIds={setScanIds} />
      )}
    </Stack>
  );
};
