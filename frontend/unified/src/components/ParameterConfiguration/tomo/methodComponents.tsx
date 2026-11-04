import {
  FormControlLabel,
  FormGroup,
  Stack,
  Switch,
  TextField,
} from "@mui/material";

export type StripeRemovalParameters = {
  snr: number;
  laSize: number;
  smSize: number;
};

type StripeRemovalParameterConfigurationProps = {
  active: boolean;
  setActive: (_: boolean) => void;
  parameters: StripeRemovalParameters;
  setParameters: (_: StripeRemovalParameters) => void;
};

export const StripeRemovalParameterConfiguration: React.FC<
  StripeRemovalParameterConfigurationProps
> = ({
  active,
  setActive,
  parameters,
  setParameters,
}: StripeRemovalParameterConfigurationProps) => {
  return (
    <FormGroup sx={{ marginBottom: 2 }}>
      <FormControlLabel
        label="Apply stripe removal"
        control={
          <Switch
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            slotProps={{ input: { "aria-label": "controlled" } }}
          />
        }
      />
      {active && (
        <Stack spacing={2} direction="row">
          <TextField
            variant="outlined"
            size="small"
            label="snr"
            value={parameters.snr}
            onChange={(e) =>
              setParameters({ ...parameters, snr: Number(e.target.value) })
            }
          />
          <TextField
            variant="outlined"
            size="small"
            label="la_size"
            value={parameters.laSize}
            onChange={(e) =>
              setParameters({ ...parameters, laSize: Number(e.target.value) })
            }
          />
          <TextField
            variant="outlined"
            size="small"
            label="sm_size"
            value={parameters.smSize}
            onChange={(e) =>
              setParameters({ ...parameters, smSize: Number(e.target.value) })
            }
          />
        </Stack>
      )}
    </FormGroup>
  );
};
