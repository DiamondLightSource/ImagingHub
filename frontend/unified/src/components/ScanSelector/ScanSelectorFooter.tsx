import { LinearProgress, Stack, Typography } from "@mui/material";
import React from "react";

/**
 * Props for the scan selector footer
 *
 * @typedef {ScanSelectorFooterProps}
 */
type ScanSelectorFooterProps = {
  totalLoaded: number;
  totalCount: number | null;
  loadMore: boolean;
};

/**
 * Scan selector footer. Shows total rows loaded, and progress bar during loading
 *
 * @param {ScanSelectorFooterProps} props - Scan selector footer props
 * @param {number} props.totalLoaded - Total number of rows loaded
 * @param {number} props.totalCount - Total number of rows available
 * @param {boolean} props.loadMore - True if the table is currently loading more data. False otherwise
 * @returns {React.JSX.Element} Footer component
 */
export const ScanSelectorFooter = ({
  totalLoaded,
  totalCount,
  loadMore,
}: ScanSelectorFooterProps): React.JSX.Element => {
  return (
    <>
      {loadMore && <LinearProgress sx={{ height: 3 }} />}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 1.5, py: 1, borderTop: 1, borderColor: "divider" }}
      >
        <Typography variant="meta" sx={{ color: "text.muted" }}>
          {totalLoaded} of {totalCount ?? "-"} loaded
        </Typography>
      </Stack>
    </>
  );
};
