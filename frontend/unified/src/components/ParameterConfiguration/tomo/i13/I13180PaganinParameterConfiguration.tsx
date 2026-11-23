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
  LoaderParameterConfiguration,
  MinimalLoaderPreviewParameters,
  PaganinFilterParameters,
  ParameterSweepConfiguration,
} from "../methodComponents";
import {
  CenteringMode,
  Magnification,
  PaganinFilterSweepParameters,
  PaganinMode,
} from "./types";
import {
  DEFAULT_CENTERING_180_AUTO_PARAMETER_VALUES,
  DEFAULT_CENTERING_180_FIXED_PARAMETER_VALUES,
  I13180PipelineConfigurationComponentProps,
} from "./I13180ParameterConfiguration";

type I13180PaganinPipelineParameterConfig =
  | {
      paganinMode: typeof PaganinMode.Fixed;
      centeringMode: typeof CenteringMode.Auto;
      parameters: {
        paganin: PaganinFilterParameters;
        centering: Centering180Parameters;
      };
    }
  | {
      paganinMode: typeof PaganinMode.Sweep;
      centeringMode: typeof CenteringMode.Auto;
      parameters: {
        loader: MinimalLoaderPreviewParameters;
        paganin: PaganinFilterSweepParameters;
        centering: Centering180Parameters;
      };
    }
  | {
      paganinMode: typeof PaganinMode.Fixed;
      centeringMode: typeof CenteringMode.Fixed;
      parameters: {
        paganin: PaganinFilterParameters;
        recon: { center: number };
      };
    }
  | {
      paganinMode: typeof PaganinMode.Sweep;
      centeringMode: typeof CenteringMode.Fixed;
      parameters: {
        loader: MinimalLoaderPreviewParameters;
        paganin: PaganinFilterSweepParameters;
        recon: { center: number };
      };
    };

const getDefaultPaganin180FixedParameterValues = (
  magnification: (typeof Magnification)[number]
) => {
  return {
    ratioDeltaBeta: 100,
    pixelSize: 3.25 / magnification,
    distance: 0.1,
    energy: 27.0,
  };
};

const getDefaultPaganin180SweepParameterValues = (
  magnification: (typeof Magnification)[number]
) => {
  return {
    ratioDeltaBeta: {
      start: 1,
      stop: 1000,
      step: 10,
    },
    pixelSize: 3.25 / magnification,
    distance: 0.1,
    energy: 27.0,
  };
};

export const I13180PaganinPipelineConfigurationComponent: React.FC<
  I13180PipelineConfigurationComponentProps & {
    magnification: typeof Magnification;
  }
> = ({ magnification }) => {
  const [pipelineParameterConfig, setPipelineParameterConfig] =
    useState<I13180PaganinPipelineParameterConfig>({
      centeringMode: CenteringMode.Auto,
      paganinMode: PaganinMode.Fixed,
      parameters: {
        centering: DEFAULT_CENTERING_180_AUTO_PARAMETER_VALUES,
        paganin: getDefaultPaganin180FixedParameterValues(magnification),
      },
    });

  return (
    <>
      <Stack direction="row" spacing={2} display="flex" alignItems="center">
        <Stack direction="row" spacing={2} display="flex" alignItems="center">
          <Typography>Paganin filter</Typography>
          <ToggleButtonGroup
            exclusive
            value={pipelineParameterConfig.paganinMode}
            aria-label="i13-180-paganin-centering-mode-toggle"
            onChange={(
              _: React.MouseEvent<HTMLElement>,
              newValue: string | null
            ) => {
              if (newValue) {
                if (newValue === "Fixed") {
                  setPipelineParameterConfig({
                    centeringMode: pipelineParameterConfig.centeringMode,
                    paganinMode: PaganinMode.Fixed,
                    parameters: {
                      ...pipelineParameterConfig.parameters,
                      paganin:
                        getDefaultPaganin180FixedParameterValues(magnification),
                    },
                  });
                } else {
                  setPipelineParameterConfig({
                    centeringMode: pipelineParameterConfig.centeringMode,
                    paganinMode: PaganinMode.Sweep,
                    parameters: {
                      ...pipelineParameterConfig.parameters,
                      // TODO: deduplicate this information that is hardcoded elsewhere
                      loader: { start: 589, stop: 599 },
                      paganin:
                        getDefaultPaganin180SweepParameterValues(magnification),
                    },
                  });
                }
              }
            }}
          >
            {Object.keys(PaganinMode).map((val) => (
              <ToggleButton key={val} value={val}>
                {val}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>
      </Stack>
      {pipelineParameterConfig.paganinMode === PaganinMode.Sweep && (
        <>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography>Loader / detector Y</Typography>
            <LoaderParameterConfiguration
              parameters={pipelineParameterConfig.parameters.loader}
              setParameters={(params) => {
                setPipelineParameterConfig({
                  ...pipelineParameterConfig,
                  parameters: {
                    ...pipelineParameterConfig.parameters,
                    loader: params,
                  },
                });
              }}
            />
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography>ratio_delta_beta</Typography>
            <ParameterSweepConfiguration
              parameters={
                pipelineParameterConfig.parameters.paganin.ratioDeltaBeta
              }
              setParameters={(sweepParams) => {
                setPipelineParameterConfig({
                  centeringMode: pipelineParameterConfig.centeringMode,
                  paganinMode: PaganinMode.Sweep,
                  parameters: {
                    ...pipelineParameterConfig.parameters,
                    paganin: {
                      ...pipelineParameterConfig.parameters.paganin,
                      ratioDeltaBeta: sweepParams,
                    },
                  },
                });
              }}
            />
          </Stack>
        </>
      )}
      {pipelineParameterConfig.paganinMode === PaganinMode.Fixed && (
        <TextField
          variant="outlined"
          size="small"
          label="ratio_delta_beta"
          value={pipelineParameterConfig.parameters.paganin.ratioDeltaBeta}
          type="number"
          onChange={(e) =>
            setPipelineParameterConfig({
              centeringMode: pipelineParameterConfig.centeringMode,
              paganinMode: pipelineParameterConfig.paganinMode,
              parameters: {
                ...pipelineParameterConfig.parameters,
                paganin: {
                  ...pipelineParameterConfig.parameters.paganin,
                  ratioDeltaBeta: Number(e.target.value),
                },
              },
            })
          }
        />
      )}
      <Stack spacing={2} direction="row">
        <TextField
          variant="outlined"
          size="small"
          label="distance"
          value={pipelineParameterConfig.parameters.paganin.distance}
          type="number"
          onChange={(e) =>
            setPipelineParameterConfig({
              centeringMode: pipelineParameterConfig.centeringMode,
              paganinMode: pipelineParameterConfig.paganinMode,
              parameters: {
                ...pipelineParameterConfig.parameters,
                paganin: {
                  ...pipelineParameterConfig.parameters.paganin,
                  distance: Number(e.target.value),
                },
              },
            })
          }
        />
        <TextField
          variant="outlined"
          size="small"
          label="energy"
          value={pipelineParameterConfig.parameters.paganin.energy}
          type="number"
          onChange={(e) =>
            setPipelineParameterConfig({
              centeringMode: pipelineParameterConfig.centeringMode,
              paganinMode: pipelineParameterConfig.paganinMode,
              parameters: {
                ...pipelineParameterConfig.parameters,
                paganin: {
                  ...pipelineParameterConfig.parameters.paganin,
                  energy: Number(e.target.value),
                },
              },
            })
          }
        />
      </Stack>
      <Stack direction="row" spacing={2} display="flex" alignItems="center">
        <Typography>Centering</Typography>
        <ToggleButtonGroup
          exclusive
          value={pipelineParameterConfig.centeringMode}
          aria-label="i13-180-paganin-centering-mode-toggle"
          onChange={(
            _: React.MouseEvent<HTMLElement>,
            newValue: string | null
          ) => {
            if (newValue) {
              if (newValue === "Auto") {
                setPipelineParameterConfig({
                  centeringMode: CenteringMode.Auto,
                  paganinMode: pipelineParameterConfig.paganinMode,
                  parameters: {
                    ...pipelineParameterConfig.parameters,
                    centering: DEFAULT_CENTERING_180_AUTO_PARAMETER_VALUES,
                  },
                });
              } else {
                setPipelineParameterConfig({
                  centeringMode: CenteringMode.Fixed,
                  paganinMode: pipelineParameterConfig.paganinMode,
                  parameters: {
                    ...pipelineParameterConfig.parameters,
                    recon: DEFAULT_CENTERING_180_FIXED_PARAMETER_VALUES,
                  },
                });
              }
            }
          }}
        >
          {Object.keys(CenteringMode)
            .filter((mode) => mode !== CenteringMode.Sweep)
            .map((val) => (
              <ToggleButton key={val} value={val}>
                {val}
              </ToggleButton>
            ))}
        </ToggleButtonGroup>
      </Stack>
      {pipelineParameterConfig.centeringMode === CenteringMode.Auto && (
        <Centering180ParameterConfiguration
          parameters={pipelineParameterConfig.parameters.centering}
          setParameters={(params) =>
            setPipelineParameterConfig({
              centeringMode: CenteringMode.Auto,
              paganinMode: pipelineParameterConfig.paganinMode,
              parameters: {
                ...pipelineParameterConfig.parameters,
                centering: params,
              },
            })
          }
        />
      )}

      {pipelineParameterConfig.centeringMode === CenteringMode.Fixed && (
        <TextField
          variant="outlined"
          size="small"
          value={pipelineParameterConfig.parameters.recon.center}
          label="centre of rotation"
          type="number"
          onChange={(e) =>
            setPipelineParameterConfig({
              paganinMode: pipelineParameterConfig.paganinMode,
              centeringMode: CenteringMode.Fixed,
              parameters: {
                ...pipelineParameterConfig.parameters,
                recon: {
                  center: Number(e.target.value),
                },
              },
            })
          }
        />
      )}
    </>
  );
};
