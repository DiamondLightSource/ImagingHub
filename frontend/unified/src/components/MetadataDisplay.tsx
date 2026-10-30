import { Typography, Stack, Skeleton, Grid } from "@mui/material";
import type { ScanNodeProcessed } from "../types";
import { getBeamlineConfig, isMetadataComponent } from "../beamline.config";

type MetadataDisplayProp = {
  selectedScanData: ScanNodeProcessed[];
  condensed?: boolean;
};
export function MetadataDisplay({
  selectedScanData,
  condensed,
}: MetadataDisplayProp) {
  const firstScan = selectedScanData.at(0);

  if (!firstScan) {
    return <Typography>No scans selected</Typography>;
  }

  const schema = firstScan.dataSchema;

  const config = getBeamlineConfig(schema);
  const title = makeTitle(selectedScanData);
  const multipleSelected = selectedScanData.length > 1;

  let maxColumns = 1;
  let components = config?.components;
  if (condensed) {
    // If condensed, limit the data display to the first two groups,
    // and place each group into its own row
    const columns = config?.components.map((x) => {
      if (!isMetadataComponent(x)) {
        return x.children.length;
      } else {
        return 1;
      }
    });
    maxColumns = columns ? Math.max(...columns) : 1;
    components = components?.slice(0, 2);
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h5">{!title ? <Skeleton /> : title}</Typography>
      <Grid container spacing={2} columns={maxColumns}>
        {components &&
          firstScan &&
          !multipleSelected &&
          components.map((x) => {
            if (isMetadataComponent(x)) {
              const val = x.getter(firstScan);
              return (
                <Grid size={1}>
                  <SingleMetadata
                    label={x?.title ? x.title : ""}
                    value={val ? x.formatter(val) : "-"}
                  />
                </Grid>
              );
            } else {
              return (
                // Draw containers
                <Grid container spacing={0} size={maxColumns}>
                  {x.children.map((y) => {
                    const val = y.getter(firstScan);
                    return (
                      <Grid size={1}>
                        <SingleMetadata
                          label={y?.title ? y.title : ""}
                          value={val ? y.formatter(val) : "-"}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              );
            }
          })}
      </Grid>
    </Stack>
  );
}

type SingleMetadataProp = {
  label: string;
  value: string;
};
export function SingleMetadata({ label, value }: SingleMetadataProp) {
  return (
    <Stack>
      <Typography
        variant="overline"
        color="text.tertiary"
        sx={{ overflow: "auto" }}
      >
        {label}
      </Typography>
      <Typography variant="body2" sx={{ overflow: "auto" }}>
        {value}
      </Typography>
    </Stack>
  );
}

export function makeTitle(scanData: ScanNodeProcessed[]): string | null {
  if (scanData.length === 0) {
    return null;
  } else if (scanData.length === 1) {
    const scanNumber = scanData.at(0)?.scanNumber;
    if (scanNumber) {
      return `${scanNumber}`;
    } else {
      return null;
    }
  } else {
    return `Selected ${scanData.length} files`;
  }
}
