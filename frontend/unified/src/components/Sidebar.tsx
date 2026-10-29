import { Navbar } from "@diamondlightsource/sci-react-ui";
import { Box, Typography, Stack } from "@mui/material";
import { ScanSelectorCombined } from "./ScanSelectorCombined";

type SidebarProps = {
  scanIds: number[];
  updateSelectedScanIds: (_: number[]) => void;
  sessionRef: string;
};

export const Sidebar: React.FC<SidebarProps> = ({
  scanIds,
  updateSelectedScanIds,
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
            scanIds={scanIds}
            setScanIds={updateSelectedScanIds}
            sessionRef={sessionRef}
          />
        </Box>
      </Stack>
    </Box>
  );
};
