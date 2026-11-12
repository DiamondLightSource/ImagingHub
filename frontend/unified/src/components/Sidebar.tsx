import { Box, Typography, Stack, Switch } from "@mui/material";
import { ScanNodeProcessed, SelectedScans } from "../types";
import { ScanSelector } from "./ScanSelector/ScanSelector";
import { ScanSelector as ScanSelectorLegacy } from "./ScanSelector/ScanSelectorLegacy";
import { useState } from "react";
import { getFieldValue } from "../beamline.config";

type SidebarProps = {
  selectedScans: SelectedScans;
  setSelectedScans: (_: SelectedScans) => void;
  sessionRef: string;
};

export const Sidebar: React.FC<SidebarProps> = ({
  selectedScans,
  setSelectedScans,
  sessionRef,
}: SidebarProps) => {
  const [useLegacySelector, setUseLegacySelector] = useState<boolean>(false);

  return (
    <>
      {useLegacySelector ? (
        <Box p={2} flex={1}>
          <ScanSelectorLegacy
            scanIds={selectedScans.scans.map((v) => v.scanNumber)}
            setScanIds={(v) => setSelectedScans({ scans: generateScanData(v) })}
          />
        </Box>
      ) : (
        <ScanSelector
          sessionRef={sessionRef}
          setSelectedScans={setSelectedScans}
        />
      )}
      <Stack
        justifyContent="center"
        alignItems="center"
        direction="row"
        paddingBottom={1}
        spacing={1}
      >
        <Typography variant="subtitle2" sx={{ color: "text.muted" }}>
          Legacy scan selector
        </Typography>
        <Switch
          size="small"
          color="warning"
          checked={useLegacySelector}
          onChange={(_, checked) => setUseLegacySelector(checked)}
        />
      </Stack>
    </>
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
