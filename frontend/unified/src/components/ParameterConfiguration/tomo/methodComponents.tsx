import {
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useState } from "react";

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

export type DistortionCorrectionParameters = {
  coefficientsFilepath: string;
};

type DistortionCorrectionParameterConfigurationProps = {
  active: boolean;
  setActive: (_: boolean) => void;
  parameters: DistortionCorrectionParameters;
  setParameters: (_: DistortionCorrectionParameters) => void;
};

export const DistortionCorrectionParameterConfiguration: React.FC<
  DistortionCorrectionParameterConfigurationProps
> = ({ active, setActive, parameters, setParameters }) => {
  return (
    <FormGroup>
      <FormControlLabel
        label="Apply distortion correction"
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
            label="Coefficients filepath"
            value={parameters.coefficientsFilepath}
            onChange={(e) =>
              setParameters({ coefficientsFilepath: e.target.value })
            }
          />
        </Stack>
      )}
    </FormGroup>
  );
};

export type Centering180Parameters = {
  smin: number;
  smax: number;
};

type Centering180ParameterConfigurationProps = {
  parameters: Centering180Parameters;
  setParameters: (_: Centering180Parameters) => void;
};

const Centering180ParameterConfiguration: React.FC<
  Centering180ParameterConfigurationProps
> = ({ parameters, setParameters }) => {
  return (
    <Stack spacing={2} direction="row">
      <TextField
        variant="outlined"
        size="small"
        label="smin"
        value={parameters.smin}
        type="number"
        onChange={(e) =>
          setParameters({ ...parameters, smin: Number(e.target.value) })
        }
      />
      <TextField
        variant="outlined"
        size="small"
        label="smax"
        type="number"
        value={parameters.smax}
        onChange={(e) =>
          setParameters({ ...parameters, smax: Number(e.target.value) })
        }
      />
    </Stack>
  );
};

const centering360SideParameterValues = ["auto", "left", "right"] as const;

export type Centering360Parameters = {
  side: (typeof centering360SideParameterValues)[number];
  winWidth: number;
};

type Centering360ParameterConfigurationProps = {
  parameters: Centering360Parameters;
  setParameters: (_: Centering360Parameters) => void;
};

const Centering360ParameterConfiguration: React.FC<
  Centering360ParameterConfigurationProps
> = ({ parameters, setParameters }) => {
  return (
    <Stack spacing={2} direction="row">
      <FormControl>
        <InputLabel id="centering-360-side-select-label">Side</InputLabel>
        <Select
          size="small"
          labelId="centering-360-side-select-label"
          id="centering-360-side-select"
          value={parameters.side}
          label="Side"
          onChange={(e: SelectChangeEvent) =>
            setParameters({ ...parameters, side: e.target.value })
          }
        >
          {centering360SideParameterValues.map((value) => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        variant="outlined"
        size="small"
        label="win_width"
        value={parameters.winWidth}
        type="number"
        onChange={(e) =>
          setParameters({ ...parameters, winWidth: Number(e.target.value) })
        }
      />
    </Stack>
  );
};

type CenteringParameterConfigurationProps =
  | Centering180ParameterConfigurationProps
  | Centering360ParameterConfigurationProps;

const CenteringMethodType = {
  180: "180",
  360: "360",
} as const;
type CenteringMethodType =
  (typeof CenteringMethodType)[keyof typeof CenteringMethodType];

export const CenteringParameterConfiguration: React.FC<
  CenteringParameterConfigurationProps
> = ({ parameters, setParameters }) => {
  const [methodType, setMethodType] = useState<CenteringMethodType>(
    CenteringMethodType[180]
  );

  return (
    <div style={{ marginBottom: 10 }}>
      <Typography>Centering</Typography>
      <Stack
        direction="row"
        display="flex"
        alignItems="center"
        spacing={2}
        marginBottom={2}
      >
        <Typography>Scan type</Typography>
        <ToggleButtonGroup
          exclusive
          value={methodType}
          aria-label="centering-method-type-toggle"
          onChange={(
            _: React.MouseEvent<HTMLElement>,
            newValue: string | null
          ) => {
            if (newValue) {
              if (newValue === "180") {
                setMethodType(CenteringMethodType[180]);
                setParameters({ smin: -50, smax: 50 });
              } else {
                setMethodType(CenteringMethodType[360]);
                setParameters({ side: "auto", winWidth: 10 });
              }
            }
          }}
        >
          <ToggleButton value={CenteringMethodType[180]}>
            {CenteringMethodType[180]}
          </ToggleButton>
          <ToggleButton value={CenteringMethodType[360]}>
            {CenteringMethodType[360]}
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      {methodType === CenteringMethodType[180] ? (
        <Centering180ParameterConfiguration
          parameters={parameters}
          setParameters={setParameters}
        />
      ) : (
        <Centering360ParameterConfiguration
          parameters={parameters}
          setParameters={setParameters}
        />
      )}
    </div>
  );
};

export type PaganinFilterParameters = {
  pixelSize: number;
  distance: number;
  energy: number;
  ratioDeltaBeta: number;
};

type PaganinFilterParameterConfigurationProps = {
  parameters: PaganinFilterParameters;
  setParameters: (_: PaganinFilterParameters) => void;
};

export const PaganinFilterParameterConfiguration: React.FC<
  PaganinFilterParameterConfigurationProps
> = ({ parameters, setParameters }) => {
  return (
    <div style={{ marginBottom: 10 }}>
      <Typography gutterBottom>Paganin filter</Typography>
      <Stack spacing={2} direction="row">
        <TextField
          variant="outlined"
          size="small"
          label="pixel_size"
          value={parameters.pixelSize}
          type="number"
          onChange={(e) =>
            setParameters({ ...parameters, pixelSize: Number(e.target.value) })
          }
        />
        <TextField
          variant="outlined"
          size="small"
          label="distance"
          value={parameters.distance}
          type="number"
          onChange={(e) =>
            setParameters({ ...parameters, distance: Number(e.target.value) })
          }
        />
        <TextField
          variant="outlined"
          size="small"
          label="energy"
          value={parameters.energy}
          type="number"
          onChange={(e) =>
            setParameters({ ...parameters, energy: Number(e.target.value) })
          }
        />
        <TextField
          variant="outlined"
          size="small"
          label="ratio_delta_beta"
          value={parameters.ratioDeltaBeta}
          type="number"
          onChange={(e) =>
            setParameters({
              ...parameters,
              ratioDeltaBeta: Number(e.target.value),
            })
          }
        />
      </Stack>
    </div>
  );
};
