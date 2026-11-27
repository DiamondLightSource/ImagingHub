import {
  Card,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputAdornment,
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
    <Card variant="outlined" sx={{ padding: 2 }}>
      <FormGroup>
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
              type="number"
              onChange={(e) =>
                setParameters({ ...parameters, snr: Number(e.target.value) })
              }
            />
            <TextField
              variant="outlined"
              size="small"
              label="la_size"
              value={parameters.laSize}
              type="number"
              onChange={(e) =>
                setParameters({ ...parameters, laSize: Number(e.target.value) })
              }
            />
            <TextField
              variant="outlined"
              size="small"
              label="sm_size"
              value={parameters.smSize}
              type="number"
              onChange={(e) =>
                setParameters({ ...parameters, smSize: Number(e.target.value) })
              }
            />
          </Stack>
        )}
      </FormGroup>
    </Card>
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
    <Card variant="outlined" sx={{ padding: 2 }}>
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
    </Card>
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

export const Centering180ParameterConfiguration: React.FC<
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

export const Centering360ParameterConfiguration: React.FC<
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
  | (Centering180ParameterConfigurationProps & {
      methodType: CenteringMethodType[180];
      setMethodType: (_: CenteringMethodType) => void;
    })
  | (Centering360ParameterConfigurationProps & {
      methodType: CenteringMethodType[360];
      setMethodType: (_: CenteringMethodType) => void;
    });

const CenteringMethodType = {
  180: "180",
  360: "360",
} as const;
type CenteringMethodType =
  (typeof CenteringMethodType)[keyof typeof CenteringMethodType];
export { CenteringMethodType };

export const CenteringParameterConfiguration: React.FC<
  CenteringParameterConfigurationProps
> = ({ methodType, setMethodType, parameters, setParameters }) => {
  return (
    <Card variant="outlined" sx={{ padding: 2 }}>
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
    </Card>
  );
};

export type I13PaganinFilterParameters = {
  distance: number;
  energy: number;
  ratioDeltaBeta: number;
};

export type PaganinFilterParameters = I13PaganinFilterParameters & {
  pixelSize: number;
};

type PaganinFilterParameterConfigurationProps = {
  parameters: PaganinFilterParameters;
  setParameters: (_: PaganinFilterParameters) => void;
};

export const PaganinFilterParameterConfiguration: React.FC<
  PaganinFilterParameterConfigurationProps
> = ({ parameters, setParameters }) => {
  return (
    <Card variant="outlined" sx={{ padding: 2 }}>
      <Typography gutterBottom>Paganin filter</Typography>
      <Stack spacing={2} direction="row">
        <TextField
          variant="outlined"
          size="small"
          label="pixel_size"
          value={parameters.pixelSize}
          type="number"
          onChange={(e) =>
            setParameters({
              ...parameters,
              pixelSize: Number(e.target.value),
            })
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
    </Card>
  );
};

export type SweepParameters = {
  start: number;
  stop: number;
  step: number;
};

type ParameterSweepConfigurationProps = {
  parameters: SweepParameters;
  setParameters: (_: SweepParameters) => void;
};

export const ParameterSweepConfiguration: React.FC<
  ParameterSweepConfigurationProps
> = ({ parameters, setParameters }) => {
  return (
    <Stack direction="row" spacing={2}>
      <TextField
        variant="outlined"
        size="small"
        value={parameters.start}
        label="start"
        type="number"
        onChange={(e) =>
          setParameters({ ...parameters, start: Number(e.target.value) })
        }
      />
      <TextField
        variant="outlined"
        size="small"
        value={parameters.stop}
        label="stop"
        type="number"
        onChange={(e) =>
          setParameters({ ...parameters, stop: Number(e.target.value) })
        }
      />
      <TextField
        variant="outlined"
        size="small"
        value={parameters.step}
        label="step"
        type="number"
        onChange={(e) =>
          setParameters({ ...parameters, step: Number(e.target.value) })
        }
      />
    </Stack>
  );
};

export type MinimalLoaderPreviewParameters = {
  start: number;
  stop: number;
};

type LoaderParameterConfigurationProps = {
  parameters: MinimalLoaderPreviewParameters;
  setParameters: (_: MinimalLoaderPreviewParameters) => void;
};

export const LoaderParameterConfiguration: React.FC<
  LoaderParameterConfigurationProps
> = ({ parameters, setParameters }: LoaderParameterConfigurationProps) => {
  return (
    <Stack spacing={2} direction="row">
      <TextField
        variant="outlined"
        size="small"
        label="start"
        value={parameters.start}
        type="number"
        onChange={(e) =>
          setParameters({ ...parameters, start: Number(e.target.value) })
        }
      />
      <TextField
        variant="outlined"
        size="small"
        label="stop"
        value={parameters.stop}
        type="number"
        onChange={(e) =>
          setParameters({ ...parameters, stop: Number(e.target.value) })
        }
      />
    </Stack>
  );
};

type OutputFolderConfigurationProps = {
  visitDirpath: string;
  outputFolder: string;
  setOutputFolder: (_: string) => void;
};

export const OutputFolderConfiguration: React.FC<
  OutputFolderConfigurationProps
> = ({ visitDirpath, outputFolder, setOutputFolder }) => {
  return (
    <TextField
      variant="outlined"
      size="small"
      label="Output folder"
      value={outputFolder}
      onChange={(e) => setOutputFolder(e.target.value)}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start" sx={{ marginRight: 0 }}>
              <Typography>{visitDirpath}</Typography>
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

const sino360To180SideParameterValues = ["left", "right"] as const;

export type Sino360To180Parameters = {
  side: (typeof sino360To180SideParameterValues)[number];
  overlap: number;
};

type Sino360To180ParameterConfigurationProps = {
  parameters: Sino360To180Parameters;
  setParameters: (_: Sino360To180Parameters) => void;
};

export const Sino360To180ParameterConfiguration: React.FC<
  Sino360To180ParameterConfigurationProps
> = ({ parameters, setParameters }) => {
  return (
    <Stack spacing={2} direction="row">
      <FormControl>
        <InputLabel id="sino-360-to-180-side-select-label">Side</InputLabel>
        <Select
          size="small"
          labelId="sino-360-to-180-side-select-label"
          id="sino-360-to-180-side-select"
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
        label="overlap"
        value={parameters.overlap}
        type="number"
        onChange={(e) =>
          setParameters({ ...parameters, overlap: Number(e.target.value) })
        }
      />
    </Stack>
  );
};
