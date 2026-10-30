import { Typography, Stack, Skeleton, Grid } from "@mui/material";
import type { ScanNodeProcessed } from "../types";
import { getBeamlineConfig, isMetadataComponent } from "../beamline.config";

type MetadataDisplayProp = {
  selectedScanData: ScanNodeProcessed[];
};
export function MetadataDisplayCondensed({
  selectedScanData,
}: MetadataDisplayProp) {
  // const [schemaJSON, setSchemaJSON] = useState<{[key: string]: any} | null>(null);

  console.log("scanNumber HubScanData ", selectedScanData);
  const firstScan = selectedScanData.at(0);

  if (!firstScan) {
    return <Typography>Select a scan</Typography>;
  }

  const beamline = firstScan.beamline?.toLowerCase();
  const schema = firstScan.dataSchema;

  const config = getBeamlineConfig(schema);
  const title = makeTitle(selectedScanData);
  const multipleSelected = selectedScanData.length > 1;

  console.log("config", config);

  return (
    <Stack spacing={2}>
      <Typography variant="h5">{!title ? <Skeleton /> : title}</Typography>

      <Stack>
        {config && firstScan && beamline && !multipleSelected ? (
          // TODO: Handle case where `beamline` doesn't exist in enum
          config.components.slice(0, 2).map((x) => {
            if (isMetadataComponent(x)) {
              const val = x.getter(firstScan);
              return (
                <Grid container spacing={2}>
                  <SingleMetadata
                    label={x?.title ? x.title : ""}
                    value={val ? x.formatter(val) : "-"}
                  />
                </Grid>
              );
            } else {
              return (
                // Draw containers
                <Grid container spacing={2}>
                  {x.children.map((y) => {
                    const val = y.getter(firstScan);
                    return (
                      <Grid size="grow">
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
          })
        ) : (
          <></>
        )}
      </Stack>
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

function makeTitle(scanData: ScanNodeProcessed[]): string | null {
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
