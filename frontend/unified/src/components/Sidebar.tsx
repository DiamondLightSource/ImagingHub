import { Navbar } from "@diamondlightsource/sci-react-ui";
import { Box, Typography } from "@mui/material";
import { ScanSelector } from "./ScanSelector";

type SidebarProps = {
  scanIds: number[];
  updateSelectedScanIds: (_: number[]) => void;
};

export const Sidebar: React.FC<SidebarProps> = ({
  scanIds,
  updateSelectedScanIds,
}: SidebarProps) => {
  return (
    <Box sx={{ padding: 2 }}>
      <Navbar visibility="hidden" />
      <Typography variant="h5">Scan</Typography>
      <ScanSelector scanIds={scanIds} setScanIds={updateSelectedScanIds} />
    </Box>
  );
};
