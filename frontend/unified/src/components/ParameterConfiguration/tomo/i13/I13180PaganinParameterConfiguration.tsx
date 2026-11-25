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
  Centering360Parameters,
  CenteringMethodType,
  LoaderParameterConfiguration,
  MinimalLoaderPreviewParameters,
  PaganinFilterParameters,
  ParameterSweepConfiguration,
  Sino360To180Parameters,
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

export const getDefaultPaganin180FixedParameterValues = (
  magnification: (typeof Magnification)[number]
) => {
  return {
    ratioDeltaBeta: 100,
    pixelSize: 3.25 / magnification,
    distance: 0.1,
    energy: 27.0,
  };
};

export const getDefaultPaganin180SweepParameterValues = (
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

type I13360PaganinPipelineParameterConfig =
  | {
      paganinMode: typeof PaganinMode.Fixed;
      centeringMode: typeof CenteringMode.Auto;
      parameters: {
        centering: Centering360Parameters;
        paganin: PaganinFilterParameters;
      };
    }
  | {
      paganinMode: typeof PaganinMode.Sweep;
      centeringMode: typeof CenteringMode.Auto;
      parameters: {
        loader: MinimalLoaderPreviewParameters;
        centering: Centering360Parameters;
        paganin: PaganinFilterSweepParameters;
      };
    }
  | {
      paganinMode: typeof PaganinMode.Fixed;
      centeringMode: typeof CenteringMode.Fixed;
      parameters: {
        paganin: PaganinFilterParameters;
        stitching: Sino360To180Parameters;
        recon: { center: number };
      };
    }
  | {
      paganinMode: typeof PaganinMode.Sweep;
      centeringMode: typeof CenteringMode.Fixed;
      parameters: {
        loader: MinimalLoaderPreviewParameters;
        paganin: PaganinFilterSweepParameters;
        stitching: Sino360To180Parameters;
        recon: { center: number };
      };
    };

export type I13180360PaganinPipelineParameterConfig =
  | {
      degreesType: (typeof CenteringMethodType)[180];
      degreesConfig: I13180PaganinPipelineParameterConfig;
    }
  | {
      degreesType: (typeof CenteringMethodType)[360];
      degreesConfig: I13360PaganinPipelineParameterConfig;
    };

export const I13180PaganinPipelineConfigurationComponent: React.FC<
  I13180PipelineConfigurationComponentProps & {
    magnification: typeof Magnification;
    config: I13180360PaganinPipelineParameterConfig;
    setConfig: (_: I13180360PaganinPipelineParameterConfig) => void;
  }
> = ({ magnification, config, setConfig }) => {
  return (
    <>
      <Stack direction="row" spacing={2} display="flex" alignItems="center">
        <Stack direction="row" spacing={2} display="flex" alignItems="center">
          <Typography>Paganin filter</Typography>
          <ToggleButtonGroup
            exclusive
            value={config.degreesConfig.paganinMode}
            aria-label="i13-180-paganin-centering-mode-toggle"
            onChange={(
              _: React.MouseEvent<HTMLElement>,
              newValue: string | null
            ) => {
              if (newValue) {
                if (newValue === "Fixed") {
                  setConfig({
                    degreesType: CenteringMethodType[180],
                    degreesConfig: {
                      centeringMode: config.degreesConfig.centeringMode,
                      paganinMode: PaganinMode.Fixed,
                      parameters: {
                        ...config.degreesConfig.parameters,
                        paganin:
                          getDefaultPaganin180FixedParameterValues(
                            magnification
                          ),
                      },
                    },
                  });
                } else {
                  setConfig({
                    degreesType: CenteringMethodType[180],
                    degreesConfig: {
                      centeringMode: config.degreesConfig.centeringMode,
                      paganinMode: PaganinMode.Sweep,
                      parameters: {
                        ...config.degreesConfig.parameters,
                        // TODO: deduplicate this information that is hardcoded elsewhere
                        loader: { start: 589, stop: 599 },
                        paganin:
                          getDefaultPaganin180SweepParameterValues(
                            magnification
                          ),
                      },
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
      {config.degreesConfig.paganinMode === PaganinMode.Sweep && (
        <>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography>Loader / detector Y</Typography>
            <LoaderParameterConfiguration
              parameters={config.degreesConfig.parameters.loader}
              setParameters={(params) => {
                setConfig({
                  degreesType: CenteringMethodType[180],
                  degreesConfig: {
                    centeringMode: config.degreesConfig.centeringMode,
                    paganinMode: PaganinMode.Sweep,
                    parameters: {
                      ...config.degreesConfig.parameters,
                      loader: params,
                    },
                  },
                });
              }}
            />
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography>ratio_delta_beta</Typography>
            <ParameterSweepConfiguration
              parameters={
                config.degreesConfig.parameters.paganin.ratioDeltaBeta
              }
              setParameters={(sweepParams) => {
                setConfig({
                  degreesType: CenteringMethodType[180],
                  degreesConfig: {
                    centeringMode: config.degreesConfig.centeringMode,
                    paganinMode: PaganinMode.Sweep,
                    parameters: {
                      ...config.degreesConfig.parameters,
                      paganin: {
                        ...config.degreesConfig.parameters.paganin,
                        ratioDeltaBeta: sweepParams,
                      },
                    },
                  },
                });
              }}
            />
          </Stack>
        </>
      )}
      {config.degreesConfig.paganinMode === PaganinMode.Fixed && (
        <TextField
          variant="outlined"
          size="small"
          label="ratio_delta_beta"
          value={config.degreesConfig.parameters.paganin.ratioDeltaBeta}
          type="number"
          onChange={(e) =>
            setConfig({
              degreesType: CenteringMethodType[180],
              degreesConfig: {
                centeringMode: config.degreesConfig.centeringMode,
                paganinMode: PaganinMode.Fixed,
                parameters: {
                  ...config.degreesConfig.parameters,
                  paganin: {
                    ...config.degreesConfig.parameters.paganin,
                    ratioDeltaBeta: Number(e.target.value),
                  },
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
          value={config.degreesConfig.parameters.paganin.distance}
          type="number"
          onChange={(e) =>
            setConfig({
              degreesType: CenteringMethodType[180],
              degreesConfig: {
                centeringMode: config.degreesConfig.centeringMode,
                paganinMode: config.degreesConfig.paganinMode,
                parameters: {
                  ...config.degreesConfig.parameters,
                  paganin: {
                    ...config.degreesConfig.parameters.paganin,
                    distance: Number(e.target.value),
                  },
                },
              },
            })
          }
        />
        <TextField
          variant="outlined"
          size="small"
          label="energy"
          value={config.degreesConfig.parameters.paganin.energy}
          type="number"
          onChange={(e) =>
            setConfig({
              degreesType: CenteringMethodType[180],
              degreesConfig: {
                centeringMode: config.degreesConfig.centeringMode,
                paganinMode: config.degreesConfig.paganinMode,
                parameters: {
                  ...config.degreesConfig.parameters,
                  paganin: {
                    ...config.degreesConfig.parameters.paganin,
                    energy: Number(e.target.value),
                  },
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
          value={config.degreesConfig.centeringMode}
          aria-label="i13-180-paganin-centering-mode-toggle"
          onChange={(
            _: React.MouseEvent<HTMLElement>,
            newValue: string | null
          ) => {
            if (newValue) {
              if (newValue === "Auto") {
                setConfig({
                  degreesType: CenteringMethodType[180],
                  degreesConfig: {
                    centeringMode: CenteringMode.Auto,
                    paganinMode: config.degreesConfig.paganinMode,
                    parameters: {
                      ...config.degreesConfig.parameters,
                      centering: DEFAULT_CENTERING_180_AUTO_PARAMETER_VALUES,
                    },
                  },
                });
              } else {
                setConfig({
                  degreesType: CenteringMethodType[180],
                  degreesConfig: {
                    centeringMode: CenteringMode.Fixed,
                    paganinMode: config.degreesConfig.paganinMode,
                    parameters: {
                      ...config.degreesConfig.parameters,
                      recon: DEFAULT_CENTERING_180_FIXED_PARAMETER_VALUES,
                    },
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
      {config.degreesConfig.centeringMode === CenteringMode.Auto && (
        <Centering180ParameterConfiguration
          parameters={config.degreesConfig.parameters.centering}
          setParameters={(params) =>
            setConfig({
              degreesType: CenteringMethodType[180],
              degreesConfig: {
                centeringMode: CenteringMode.Auto,
                paganinMode: config.degreesConfig.paganinMode,
                parameters: {
                  ...config.degreesConfig.parameters,
                  centering: params,
                },
              },
            })
          }
        />
      )}

      {config.degreesConfig.centeringMode === CenteringMode.Fixed && (
        <TextField
          variant="outlined"
          size="small"
          value={config.degreesConfig.parameters.recon.center}
          label="centre of rotation"
          type="number"
          onChange={(e) =>
            setConfig({
              degreesType: CenteringMethodType[180],
              degreesConfig: {
                paganinMode: config.degreesConfig.paganinMode,
                centeringMode: CenteringMode.Fixed,
                parameters: {
                  ...config.degreesConfig.parameters,
                  recon: {
                    center: Number(e.target.value),
                  },
                },
              },
            })
          }
        />
      )}
    </>
  );
};
