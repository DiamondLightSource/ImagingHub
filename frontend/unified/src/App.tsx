import { Box, Divider, Grid, Stack, Typography } from "@mui/material";
import { SessionSelector } from "./components/SessionSelector";
import { ScanSelector } from "./components/ScanSelector";

const VERTICAL_SPACING = 2;
const HORIZONTAL_SPACING = 2;

export const App: React.FC = () => {
  return (
    <>
      <Grid container spacing={HORIZONTAL_SPACING} columns={2}>
        <Stack spacing={VERTICAL_SPACING}>
          <Typography variant="h5">Session</Typography>
          <SessionSelector />
          <Divider sx={{ width: "100%" }} />
          <Typography variant="h5">Scan</Typography>
          <ScanSelector />
          <Divider sx={{ width: "100%" }} />
          <Typography variant="h5">App</Typography>
          <PlaceholderComponent
            placeholderText="App selector component placeholder"
            height={100}
            width={500}
          />
          <Divider sx={{ width: "100%" }} />
          <Typography variant="h5">Parameter Configuration</Typography>
          <PlaceholderComponent
            placeholderText="Parameter configuration component placeholder"
            height={200}
            width={500}
          />
        </Stack>
        <Stack spacing={VERTICAL_SPACING}>
          <Typography variant="h5">Plot</Typography>
          <PlaceholderComponent
            placeholderText="Plot component placeholder"
            height={200}
            width={500}
          />
          <Divider sx={{ width: "100%" }} />
          <Typography variant="h5">Log</Typography>
          <PlaceholderComponent
            placeholderText="Log component placeholder"
            height={200}
            width={500}
          />
          <Divider sx={{ width: "100%" }} />
          <Typography variant="h5">Jobs</Typography>
          <PlaceholderComponent
            placeholderText="Jobs component placeholder"
            height={200}
            width={500}
          />
        </Stack>
      </Grid>
    </>
  );
};

type PlaceholderComponentProps = {
  placeholderText: string;
  height: number;
  width: number;
};

const PlaceholderComponent = ({
  placeholderText,
  height,
  width,
}: PlaceholderComponentProps) => {
  return (
    <Box
      sx={{ width: width, height: height, border: "1px dashed grey" }}
      alignContent="center"
      justifyItems="center"
    >
      <p>{placeholderText}</p>
    </Box>
  );
};
