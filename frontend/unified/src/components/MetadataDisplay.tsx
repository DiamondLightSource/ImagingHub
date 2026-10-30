import { Typography, Stack, Skeleton } from "@mui/material";
import type { ScanNodeProcessed } from "../types";
import { getBeamlineConfig, isMetadataComponent } from "../beamline.config";

type MetadataDisplayProp = {
  selectedScanData: ScanNodeProcessed[];
};
export function MetadataDisplay({ selectedScanData }: MetadataDisplayProp) {
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

      <Stack spacing={2}>
        {config &&
          firstScan &&
          beamline &&
          !multipleSelected &&
          config.components.map((x) => {
            if (isMetadataComponent(x)) {
              const val = x.getter(firstScan);
              return (
                <SingleMetadata
                  label={x?.title ? x.title : ""}
                  value={val ? x.formatter(val) : "-"}
                />
              );
            } else {
              return (
                // Draw containers
                <Stack>
                  {x.children.map((y) => {
                    const val = y.getter(firstScan);
                    return (
                      <SingleMetadata
                        label={y?.title ? y.title : ""}
                        value={val ? y.formatter(val) : "-"}
                      />
                    );
                  })}
                </Stack>
              );
            }
          })}
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
