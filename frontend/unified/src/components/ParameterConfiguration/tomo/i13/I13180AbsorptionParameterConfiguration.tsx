import { useEffect, useState } from "react";
import {
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { CenteringMode, Magnification } from "./types";
import {
  Centering180ParameterConfiguration,
  Centering180Parameters,
  Centering360Parameters,
  CenteringMethodType,
  LoaderParameterConfiguration,
  MinimalLoaderPreviewParameters,
  ParameterSweepConfiguration,
  Sino360To180Parameters,
  SweepParameters,
} from "../methodComponents";
import {
  DEFAULT_CENTERING_180_AUTO_PARAMETER_VALUES,
  DEFAULT_CENTERING_180_FIXED_PARAMETER_VALUES,
  DEFAULT_CENTERING_180_SWEEP_PARAMETER_VALUES,
  I13180PipelineConfigurationComponentProps,
} from "./I13180ParameterConfiguration";

const generateDistortionCorrectionCoefficientsFilepath = (
  visitDirpath: string,
  magnification: (typeof Magnification)[number]
) => {
  let posString: string;
  switch (magnification) {
    case 1.25:
      posString = "Pos1_125x";
      break;
    case 2:
      posString = "Pos2_2x";
      break;
    case 4:
      posString = "Pos4_4x";
      break;
    case 10:
      posString = "Pos5_10x";
  }

  return `${visitDirpath}processing/distortion_corrections/results_4thOrder/${posString}/coefficients_bwfw.txt`;
};

type I13180AbsorptionPipelineParameterConfig =
  | {
      centeringMode: typeof CenteringMode.Auto;
      parameters: Centering180Parameters;
    }
  | {
      centeringMode: typeof CenteringMode.Sweep;
      parameters: {
        loader: MinimalLoaderPreviewParameters;
        center: SweepParameters;
      };
    }
  | {
      centeringMode: typeof CenteringMode.Fixed;
      parameters: { center: number };
    };

type I13360AbsorptionPipelineParameterConfig =
  | {
      centeringMode: typeof CenteringMode.Auto;
      parameters: Centering360Parameters;
    }
  | {
      centeringMode: typeof CenteringMode.Sweep;
      parameters: {
        loader: MinimalLoaderPreviewParameters;
        stitching: Sino360To180Parameters;
        center: SweepParameters;
      };
    }
  | {
      centeringMode: typeof CenteringMode.Fixed;
      parameters: { stitching: Sino360To180Parameters; center: number };
    };

type I13180360AbsorptionPipelineParameterConfig =
  | {
      degreesType: (typeof CenteringMethodType)[180];
      config: I13180AbsorptionPipelineParameterConfig;
    }
  | {
      degreesType: (typeof CenteringMethodType)[360];
      config: I13360AbsorptionPipelineParameterConfig;
    };

export const I13180AbsorptionPipelineConfigurationComponent: React.FC<
  I13180PipelineConfigurationComponentProps & {
    magnification: typeof Magnification;
  }
> = ({ magnification, visitDirpath, setParameters }) => {
  const [pipelineParameterConfig, setPipelineParameterConfig] =
    useState<I13180360AbsorptionPipelineParameterConfig>({
      degreesType: CenteringMethodType[180],
      config: {
        centeringMode: CenteringMode.Auto,
        parameters: DEFAULT_CENTERING_180_AUTO_PARAMETER_VALUES,
      },
    });

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

    if (pipelineParameterConfig.config.centeringMode === CenteringMode.Sweep) {
      pipeline[0]["parameters"]["preview"] = {
        detector_y: pipelineParameterConfig.config.parameters.loader,
      };
    }

    if (pipelineParameterConfig.degreesType === CenteringMethodType[180]) {
      if (pipelineParameterConfig.config.centeringMode === CenteringMode.Auto) {
        pipeline.push({
          method: "find_center_vo",
          module_path: "httomolibgpu.recon.rotation",
          parameters: {
            ind: null,
            average_radius: 0,
            cor_initialisation_value: null,
            smin: pipelineParameterConfig.config.parameters.smin,
            smax: pipelineParameterConfig.config.parameters.smax,
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
        method: "minus_log",
        module_path: "httomolibgpu.prep.normalize",
        parameters: {},
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

    if (pipelineParameterConfig.degreesType === CenteringMethodType[180]) {
      if (pipelineParameterConfig.config.centeringMode === CenteringMode.Auto) {
        pipeline.push(
          generateReconMethod("${{centering.side_outputs.centre_of_rotation}}")
        );
      } else if (
        pipelineParameterConfig.config.centeringMode === CenteringMode.Sweep
      ) {
        pipeline.push(
          generateReconMethod({
            start: pipelineParameterConfig.config.parameters.center.start,
            stop: pipelineParameterConfig.config.parameters.center.stop,
            step: pipelineParameterConfig.config.parameters.center.step,
          })
        );
      } else {
        pipeline.push(
          generateReconMethod(pipelineParameterConfig.config.parameters.center)
        );
      }
    } else {
      // TODO: handle 360 case
    }

    if (pipelineParameterConfig.degreesType === CenteringMethodType[180]) {
      if (
        pipelineParameterConfig.config.centeringMode !== CenteringMode.Sweep
      ) {
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
    setParameters({
      config: generatePipeline(),
    });
  }, [magnification, pipelineParameterConfig]);

  const display180Configurator = (
    config: I13180AbsorptionPipelineParameterConfig
  ) => {
    switch (config.centeringMode) {
      case "Auto":
        return (
          <Centering180ParameterConfiguration
            parameters={config.parameters}
            setParameters={(params) =>
              setPipelineParameterConfig({
                ...pipelineParameterConfig,
                config: {
                  ...config,
                  parameters: params,
                },
              })
            }
          />
        );
      case "Sweep":
        return (
          <>
            <LoaderParameterConfiguration
              parameters={config.parameters.loader}
              setParameters={(params) => {
                setPipelineParameterConfig({
                  ...pipelineParameterConfig,
                  parameters: {
                    ...config.parameters,
                    loader: params,
                  },
                });
              }}
            />
            <ParameterSweepConfiguration
              parameters={config.parameters.center}
              setParameters={(params) =>
                setPipelineParameterConfig({
                  ...pipelineParameterConfig,
                  parameters: {
                    ...config.parameters,
                    center: params,
                  },
                })
              }
            />
          </>
        );
      case "Fixed":
        return (
          <TextField
            variant="outlined"
            size="small"
            value={config.parameters.center}
            label="centre of rotation"
            type="number"
            onChange={(e) =>
              setPipelineParameterConfig({
                ...pipelineParameterConfig,
                parameters: {
                  center: Number(e.target.value),
                },
              })
            }
          />
        );
    }
  };

  const displayPipelineParameterConfigurator = () => {
    switch (pipelineParameterConfig.degreesType) {
      case CenteringMethodType[180]:
        return display180Configurator(pipelineParameterConfig.config);
      case CenteringMethodType[360]:
      // TODO
    }
  };

  return (
    <>
      <Stack direction="row" spacing={2} display="flex" alignItems="center">
        <Stack direction="row" spacing={2} display="flex" alignItems="center">
          <Typography>Centering</Typography>
          <ToggleButtonGroup
            exclusive
            value={pipelineParameterConfig.config.centeringMode}
            aria-label="i13-centering-mode-toggle"
            onChange={(
              _: React.MouseEvent<HTMLElement>,
              newValue: string | null
            ) => {
              if (newValue) {
                if (newValue === "Auto") {
                  setPipelineParameterConfig({
                    degreesType: CenteringMethodType[180],
                    config: {
                      centeringMode: CenteringMode.Auto,
                      parameters: DEFAULT_CENTERING_180_AUTO_PARAMETER_VALUES,
                    },
                  });
                } else if (newValue === "Sweep") {
                  setPipelineParameterConfig({
                    degreesType: CenteringMethodType[180],
                    config: {
                      centeringMode: CenteringMode.Sweep,
                      parameters: DEFAULT_CENTERING_180_SWEEP_PARAMETER_VALUES,
                    },
                  });
                } else {
                  setPipelineParameterConfig({
                    degreesType: CenteringMethodType[180],
                    config: {
                      centeringMode: CenteringMode.Fixed,
                      parameters: DEFAULT_CENTERING_180_FIXED_PARAMETER_VALUES,
                    },
                  });
                }
              }
            }}
          >
            {Object.keys(CenteringMode).map((val) => (
              <ToggleButton key={val} value={val}>
                {val}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>
      </Stack>
      {displayPipelineParameterConfigurator()}
    </>
  );
};
