import { useState } from "react";
import {
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import {
  Centering180ParameterConfiguration,
  Centering180Parameters,
} from "./methodComponents";

const ScanType = {
  180: "180",
  360: "360",
  Radiography: "Radiography",
  TXM: "TXM",
} as const;
type ScanType = (typeof ScanType)[keyof typeof ScanType];

const Magnification = [1.25, 2, 4, 10] as const;

const PipelineType = {
  Absorption: "Absorption",
  Paganin: "Paganin",
} as const;
type PipelineType = (typeof PipelineType)[keyof typeof PipelineType];

const CenteringMode = {
  Auto: "Auto",
  Sweep: "Sweep",
  Fixed: "Fixed",
} as const;
type CenteringMode = (typeof CenteringMode)[keyof typeof CenteringMode];

export const I13ParameterConfiguration = () => {
  const [scanType, setScanType] = useState<ScanType>(ScanType[180]);

  const displayScanTypeConfigurationComponent = () => {
    if (scanType === ScanType[180]) {
      return <I13180PipelineConfigurationComponent />;
    } else {
      return <p>Not implemented</p>;
    }
  };

  return (
    <Stack direction="column" spacing={2} marginBottom={2}>
      <Stack direction="row" spacing={2} display="flex" alignItems="center">
        <Typography>Scan type</Typography>
        <ToggleButtonGroup
          exclusive
          value={scanType}
          aria-label="i13-scan-type-toggle"
          onChange={(
            _: React.MouseEvent<HTMLElement>,
            newValue: string | null
          ) => {
            if (newValue) {
              if (newValue === "180") {
                setScanType(ScanType[180]);
              } else if (newValue === "360") {
                setScanType(ScanType[360]);
              } else if (newValue === "Radiography") {
                setScanType(ScanType.Radiography);
              } else {
                setScanType(ScanType.TXM);
              }
            }
          }}
        >
          {Object.keys(ScanType).map((val) => (
            <ToggleButton value={val}>{val}</ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>
      {displayScanTypeConfigurationComponent()}
    </Stack>
  );
};

type I13180AutoPipelineParameterConfig = {
  type: typeof CenteringMode.Auto;
  parameters: Centering180Parameters;
};

type I13180SweepPipelineParameterConfig = {
  type: typeof CenteringMode.Sweep;
  parameters: SweepParameters;
};

type I13180FixedPipelineParameterConfig = {
  type: typeof CenteringMode.Fixed;
  parameters: { cor: number };
};

type I13180PipelineParameters =
  | I13180AutoPipelineParameterConfig
  | I13180SweepPipelineParameterConfig
  | I13180FixedPipelineParameterConfig;

type SweepParameters = {
  start: number;
  stop: number;
  step: number;
};

const DEFAULT_CENTERING_180_AUTO_PARAMETER_VALUES = {
  smin: -50,
  smax: 50,
};

const DEFAULT_CENTERING_180_SWEEP_PARAMETER_VALUES = {
  start: 1180,
  stop: 1380,
  step: 2.0,
};

const DEFAULT_CENTERING_180_FIXED_PARAMETER_VALUES = {
  cor: 1280,
};

const I13180PipelineConfigurationComponent = () => {
  const [magnification, setMagnification] =
    useState<(typeof Magnification)[number]>(1.25);
  const [pipelineType, setPipelineType] = useState<PipelineType>(
    PipelineType.Absorption
  );
  const [pipelineParameterConfig, setPipelineParameterConfig] =
    useState<I13180PipelineParameters>({
      type: CenteringMode.Auto,
      parameters: DEFAULT_CENTERING_180_AUTO_PARAMETER_VALUES,
    });

  const displayPipelineParameterConfigurator = () => {
    switch (pipelineParameterConfig.type) {
      case "Auto":
        return (
          <Centering180ParameterConfiguration
            parameters={pipelineParameterConfig.parameters}
            setParameters={(params) =>
              setPipelineParameterConfig({
                type: CenteringMode.Auto,
                parameters: params,
              })
            }
          />
        );
      case "Sweep":
        return (
          <Stack direction="row" spacing={2}>
            <TextField
              variant="outlined"
              size="small"
              value={pipelineParameterConfig.parameters.start}
              label="start"
              type="number"
              onChange={(e) =>
                setPipelineParameterConfig({
                  ...pipelineParameterConfig,
                  parameters: {
                    ...pipelineParameterConfig.parameters,
                    start: Number(e.target.value),
                  },
                })
              }
            />
            <TextField
              variant="outlined"
              size="small"
              value={pipelineParameterConfig.parameters.stop}
              label="stop"
              type="number"
              onChange={(e) =>
                setPipelineParameterConfig({
                  ...pipelineParameterConfig,
                  parameters: {
                    ...pipelineParameterConfig.parameters,
                    stop: Number(e.target.value),
                  },
                })
              }
            />
            <TextField
              variant="outlined"
              size="small"
              value={pipelineParameterConfig.parameters.step}
              label="step"
              type="number"
              onChange={(e) =>
                setPipelineParameterConfig({
                  ...pipelineParameterConfig,
                  parameters: {
                    ...pipelineParameterConfig.parameters,
                    step: Number(e.target.value),
                  },
                })
              }
            />
          </Stack>
        );
      case "Fixed":
        return (
          <TextField
            variant="outlined"
            size="small"
            value={pipelineParameterConfig.parameters.cor}
            label="centre of rotation"
            type="number"
            onChange={(e) =>
              setPipelineParameterConfig({
                ...pipelineParameterConfig,
                parameters: {
                  cor: Number(e.target.value),
                },
              })
            }
          />
        );
    }
  };

  return (
    <>
      <Stack direction="row" spacing={2} display="flex" alignItems="center">
        <Typography>Magnification</Typography>
        <ToggleButtonGroup
          exclusive
          value={magnification}
          aria-label="i13-magnification-toggle"
          onChange={(
            _: React.MouseEvent<HTMLElement>,
            newValue: number | null
          ) => {
            if (newValue) {
              if (newValue === 1.25) {
                setMagnification(1.25);
              } else if (newValue === 2) {
                setMagnification(2);
              } else if (newValue === 4) {
                setMagnification(4);
              } else {
                setMagnification(10);
              }
            }
          }}
        >
          {Magnification.map((mag) => (
            <ToggleButton value={mag}>{`x${mag}`}</ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>
      <Stack direction="row" spacing={2} display="flex" alignItems="center">
        <Typography>Pipeline type</Typography>
        <ToggleButtonGroup
          exclusive
          value={pipelineType}
          aria-label="i13-pipeline-type-toggle"
          onChange={(
            _: React.MouseEvent<HTMLElement>,
            newValue: string | null
          ) => {
            if (newValue) {
              if (newValue === "Absorption") {
                setPipelineType(PipelineType.Absorption);
              } else {
                setPipelineType(PipelineType.Paganin);
              }
            }
          }}
        >
          {Object.keys(PipelineType).map((val) => (
            <ToggleButton value={val}>{val}</ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>
      <Stack direction="row" spacing={2} display="flex" alignItems="center">
        <Typography>Centering</Typography>
        <ToggleButtonGroup
          exclusive
          value={pipelineParameterConfig.type}
          aria-label="i13-centering-mode-toggle"
          onChange={(
            _: React.MouseEvent<HTMLElement>,
            newValue: string | null
          ) => {
            if (newValue) {
              if (newValue === "Auto") {
                setPipelineParameterConfig({
                  type: CenteringMode.Auto,
                  parameters: DEFAULT_CENTERING_180_AUTO_PARAMETER_VALUES,
                });
              } else if (newValue === "Sweep") {
                setPipelineParameterConfig({
                  type: CenteringMode.Sweep,
                  parameters: DEFAULT_CENTERING_180_SWEEP_PARAMETER_VALUES,
                });
              } else {
                setPipelineParameterConfig({
                  type: CenteringMode.Fixed,
                  parameters: DEFAULT_CENTERING_180_FIXED_PARAMETER_VALUES,
                });
              }
            }
          }}
        >
          {Object.keys(CenteringMode).map((val) => (
            <ToggleButton value={val}>{val}</ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>
      {displayPipelineParameterConfigurator()}
    </>
  );
};
