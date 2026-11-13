import { LinearProgress, Stack, Typography } from "@mui/material";

type ScanSelectorFooterProps = {
  totalLoaded: number;
  totalCount: number | null;
  loadMore: boolean;
};
export const ScanSelectorFooter = ({
  totalLoaded,
  totalCount,
  loadMore,
}: ScanSelectorFooterProps) => {
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
