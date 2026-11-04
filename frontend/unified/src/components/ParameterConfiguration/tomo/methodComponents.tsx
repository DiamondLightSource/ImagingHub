import { Stack, TextField } from "@mui/material";

export type StripeRemovalParameters = {
  snr: number;
  laSize: number;
  smSize: number;
};

type StripeRemovalParameterConfigurationProps = {
  parameters: StripeRemovalParameters;
  setParameters: (_: StripeRemovalParameters) => void;
};

export const StripeRemovalParameterConfiguration: React.FC<
  StripeRemovalParameterConfigurationProps
> = ({
  parameters,
  setParameters,
}: StripeRemovalParameterConfigurationProps) => {
  return (
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
  );
};
