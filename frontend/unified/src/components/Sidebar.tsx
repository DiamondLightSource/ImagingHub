import { Navbar } from "@diamondlightsource/sci-react-ui";
import { Box, Typography, Stack } from "@mui/material";
import { ScanSelectorCombined } from "./ScanSelectorCombined";
import { ScanNodeProcessed } from "../types";

type SidebarProps = {
  scanData: ScanNodeProcessed[];
  updateScanData: (_: ScanNodeProcessed[]) => void;
  sessionRef: string;
};

export const Sidebar: React.FC<SidebarProps> = ({
  scanData,
  updateScanData,
  sessionRef,
}: SidebarProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      <Navbar />
      <Stack
        spacing={2}
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          padding: 2,
        }}
      >
        <Typography variant="h5">Scan</Typography>

        {/* Force the (new) scan selector to handle scrolling itself.
        This is to ensure infinite scroll works correctly. */}
        <Box sx={{ height: "100%", minHeight: 0 }}>
          <ScanSelectorCombined
            scanData={scanData}
            updateScanData={updateScanData}
            sessionRef={sessionRef}
          />
        </Box>
      </Stack>
    </Box>
  );
};
