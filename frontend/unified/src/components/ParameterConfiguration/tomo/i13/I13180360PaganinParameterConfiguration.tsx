import { useEffect } from "react";
import {
  Card,
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
  I13PaganinFilterParameters,
  LoaderParameterConfiguration,
  MinimalLoaderPreviewParameters,
  PaganinFilterParameters,
  ParameterSweepConfiguration,
  Sino360To180Parameters,
} from "../methodComponents";
import {
  CenteringMode,
  Magnification,
  I13PaganinFilterSweepParameters,
  PaganinMode,
} from "./types";
import {
  DEFAULT_CENTERING_180_AUTO_PARAMETER_VALUES,
  DEFAULT_CENTERING_180_FIXED_PARAMETER_VALUES,
  I13180360PipelineConfigurationComponentProps,
} from "./I13180360ParameterConfiguration";
import { generateDistortionCorrectionCoefficientsFilepath } from "./utils";

type I13180PaganinPipelineParameterConfig =
  | {
      paganinMode: typeof PaganinMode.Fixed;
      centeringMode: typeof CenteringMode.Auto;
      parameters: {
        paganin: I13PaganinFilterParameters;
        centering: Centering180Parameters;
      };
    }
  | {
      paganinMode: typeof PaganinMode.Sweep;
      centeringMode: typeof CenteringMode.Auto;
      parameters: {
        loader: MinimalLoaderPreviewParameters;
        paganin: I13PaganinFilterParameters;
        centering: Centering180Parameters;
      };
    }
  | {
      paganinMode: typeof PaganinMode.Fixed;
      centeringMode: typeof CenteringMode.Fixed;
      parameters: {
        paganin: I13PaganinFilterParameters;
        recon: { center: number };
      };
    }
  | {
      paganinMode: typeof PaganinMode.Sweep;
      centeringMode: typeof CenteringMode.Fixed;
      parameters: {
        loader: MinimalLoaderPreviewParameters;
        paganin: I13PaganinFilterParameters;
        recon: { center: number };
      };
    };

export const DEFAULT_PAGANIN_180_FIXED_PARAMETER_VALUES = {
  ratioDeltaBeta: 100,
  distance: 0.1,
  energy: 27.0,
};

export const DEFAULT_PAGANIN_180_SWEEP_PARAMETER_VALUES = {
  ratioDeltaBeta: {
    start: 1,
    stop: 1000,
    step: 10,
  },
  distance: 0.1,
  energy: 27.0,
};

type I13360PaganinPipelineParameterConfig =
  | {
      paganinMode: typeof PaganinMode.Fixed;
      centeringMode: typeof CenteringMode.Auto;
      parameters: {
        centering: Centering360Parameters;
        paganin: I13PaganinFilterParameters;
      };
    }
  | {
      paganinMode: typeof PaganinMode.Sweep;
      centeringMode: typeof CenteringMode.Auto;
      parameters: {
        loader: MinimalLoaderPreviewParameters;
        centering: Centering360Parameters;
        paganin: I13PaganinFilterSweepParameters;
      };
    }
  | {
      paganinMode: typeof PaganinMode.Fixed;
      centeringMode: typeof CenteringMode.Fixed;
      parameters: {
        paganin: I13PaganinFilterParameters;
        stitching: Sino360To180Parameters;
        recon: { center: number };
      };
    }
  | {
      paganinMode: typeof PaganinMode.Sweep;
      centeringMode: typeof CenteringMode.Fixed;
      parameters: {
        loader: MinimalLoaderPreviewParameters;
        paganin: I13PaganinFilterSweepParameters;
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

export const I13180360PaganinPipelineConfigurationComponent: React.FC<
  I13180360PipelineConfigurationComponentProps & {
    magnification: typeof Magnification;
    config: I13180360PaganinPipelineParameterConfig;
    setConfig: (_: I13180360PaganinPipelineParameterConfig) => void;
  }
> = ({ magnification, config, setConfig, visitDirpath, setParameters }) => {
  const generatePipeline = () => {
    const pipeline = [
      {
        method: "standard_tomo",
        module_path: "httomo.data.hdf.loaders",
        parameters: {
          data_path: "auto",
          image_key_path: "auto",
          rotation_angles: "auto",
          preview: null,
          darks: null,
          flats: null,
          continuous_scan_subset: null,
        },
      },
      {
        method: "remove_outlier",
        module_path: "httomolibgpu.misc.corr",
        parameters: {
          kernel_size: 3,
          dif: 1000,
        },
      },
      {
        method: "dark_flat_field_correction",
        module_path: "httomolibgpu.prep.normalize",
        parameters: {
          flats_multiplier: 1,
          darks_multiplier: 1,
          upper_bound: null,
          lower_bound: null,
        },
      },
      {
        method: "distortion_correction_proj_discorpy",
        module_path: "httomolibgpu.prep.alignment",
        parameters: {
          metadata_path: generateDistortionCorrectionCoefficientsFilepath(
            visitDirpath,
            magnification
          ),
          order: 3,
          mode: "constant",
        },
      },
    ];

    if (config.degreesConfig.paganinMode === PaganinMode.Sweep) {
      pipeline[0]["parameters"]["preview"] = {
        detector_y: config.degreesConfig.parameters.loader,
      };
    }

    if (config.degreesType === CenteringMethodType[180]) {
      if (config.degreesConfig.centeringMode === CenteringMode.Auto) {
        pipeline.push({
          method: "find_center_vo",
          module_path: "httomolibgpu.recon.rotation",
          parameters: {
            ind: null,
            average_radius: 0,
            cor_initialisation_value: null,
            smin: config.degreesConfig.parameters.centering.smin,
            smax: config.degreesConfig.parameters.centering.smax,
            srad: 6,
            step: 0.5,
            ratio: 0.5,
            drop: 20,
          },

          id: "centering",
          side_outputs: {
            cor: "centre_of_rotation",
          },
        });
      }
    } else {
      // TODO: handle 360 case
    }

    pipeline.push(
      {
        method: "remove_stripe_based_sorting",
        module_path: "httomolibgpu.prep.stripe",
        parameters: {
          size: 11,
          dim: 1,
        },
      },
      {
        method: "paganin_filter",
        module_path: "httomolibgpu.prep.phase",
        parameters: {
          ratio_delta_beta:
            config.degreesConfig.parameters.paganin.ratioDeltaBeta,
          pixel_size: 3.25 / magnification,
          distance: config.degreesConfig.parameters.paganin.distance,
          energy: config.degreesConfig.parameters.paganin.energy,
          calculate_padding_value_method: "next_power_of_2",
          pad_x_y: null,
        },
      }
    );

    const generateReconMethod = (center: number | string | SweepParameters) => {
      return {
        method: "FBP3d_tomobar",
        module_path: "httomolibgpu.recon.algorithm",
        parameters: {
          center: center,
          detector_pad: false,
          filter_freq_cutoff: 0.35,
          recon_size: null,
          recon_mask_radius: 0.95,
        },
        save_result: false,
      };
    };

    if (config.degreesType === CenteringMethodType[180]) {
      if (config.degreesConfig.centeringMode === CenteringMode.Auto) {
        pipeline.push(
          generateReconMethod("${{centering.side_outputs.centre_of_rotation}}")
        );
      } else if (config.degreesConfig.centeringMode === CenteringMode.Sweep) {
        pipeline.push(
          generateReconMethod({
            start: config.degreesConfig.parameters.center.start,
            stop: config.degreesConfig.parameters.center.stop,
            step: config.degreesConfig.parameters.center.step,
          })
        );
      } else {
        pipeline.push(
          generateReconMethod(config.degreesConfig.parameters.center)
        );
      }
    } else {
      // TODO: handle 360 case
    }

    if (config.degreesType === CenteringMethodType[180]) {
      if (config.degreesConfig.paganinMode !== PaganinMode.Sweep) {
        pipeline.push(
          {
            method: "calculate_stats",
            module_path: "httomo.methods",
            parameters: {},
            id: "statistics",
            side_outputs: {
              glob_stats: "glob_stats",
            },
          },
          {
            method: "rescale_to_int",
            module_path: "httomolib.misc.rescale",
            parameters: {
              perc_range_min: 1,
              perc_range_max: 99,
              bits: 16,
              glob_stats: "${{statistics.side_outputs.glob_stats}}",
            },
          },
          {
            method: "save_to_images",
            module_path: "httomolib.misc.images",
            parameters: {
              subfolder_name: "images",
              axis: "auto",
              file_format: "tif",
              asynchronous: true,
            },
          }
        );
      }
    } else {
      // TODO: handle 360 case
    }

    return pipeline;
  };

  useEffect(() => {
    setParameters(generatePipeline());
  }, [magnification, config]);

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
                        paganin: DEFAULT_PAGANIN_180_FIXED_PARAMETER_VALUES,
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
                        paganin: DEFAULT_PAGANIN_180_SWEEP_PARAMETER_VALUES,
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
      <Card
        variant="outlined"
        sx={{
          mb: 2,
          p: 2,
          border: "1px solid #89987880",
          borderRadius: "4px",
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          display="flex"
          alignItems="center"
          marginBottom={1}
        >
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
      </Card>
    </>
  );
};
