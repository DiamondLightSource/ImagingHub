import { useEffect, useState } from "react";
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
  OutputFolderConfiguration,
  PaganinFilterParameters,
  ParameterSweepConfiguration,
  SweepParameters,
} from "./methodComponents";
import { TemplateComponentProps } from "../../../types";

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

export const I13ParameterConfiguration: React.FC<TemplateComponentProps> = ({
  visitDirpath,
  setParameters,
}) => {
  const [scanType, setScanType] = useState<ScanType>(ScanType[180]);
  const [outputFolder, setOutputFolder] = useState<string>("");

  const displayScanTypeConfigurationComponent = () => {
    if (scanType === ScanType[180]) {
      return (
        <I13180PipelineConfigurationComponent
          visitDirpath={visitDirpath}
          outputFolder={outputFolder}
          setOutputFolder={setOutputFolder}
          setParameters={(pipelineParams) => {
            const date = new Date();
            const httomoOutdirName = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}_output`;
            setParameters({
              ...pipelineParams,
              output: visitDirpath + outputFolder,
              "httomo-outdir-name": httomoOutdirName,
            });
          }}
        />
      );
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
            <ToggleButton key={val} value={val}>
              {val}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>
      {displayScanTypeConfigurationComponent()}
      <OutputFolderConfiguration
        visitDirpath={visitDirpath}
        outputFolder={outputFolder}
        setOutputFolder={setOutputFolder}
      />
    </Stack>
  );
};

type I13180PipelineConfigurationComponentProps = {
  visitDirpath: string;
  setParameters: (_: object) => void;
};

const I13180PipelineConfigurationComponent: React.FC<
  I13180PipelineConfigurationComponentProps
> = ({ visitDirpath, setParameters }) => {
  const [magnification, setMagnification] =
    useState<(typeof Magnification)[number]>(1.25);
  const [pipelineType, setPipelineType] = useState<PipelineType>(
    PipelineType.Absorption
  );

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
            <ToggleButton key={mag} value={mag}>{`x${mag}`}</ToggleButton>
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
            <ToggleButton key={val} value={val}>
              {val}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>
      {pipelineType === PipelineType.Absorption ? (
        <I13180AbsorptionPipelineConfigurationComponent
          magnification={magnification}
          visitDirpath={visitDirpath}
          setParameters={setParameters}
        />
      ) : (
        <I13180PaganinPipelineConfigurationComponent
          magnification={magnification}
          visitDirpath={visitDirpath}
          setParameters={setParameters}
        />
      )}
    </>
  );
};

const PaganinMode = {
  Sweep: "Sweep",
  Fixed: "Fixed",
} as const;
type PaganinMode = (typeof PaganinMode)[keyof typeof PaganinMode];

type PaganinFilterSweepParameters = Omit<
  PaganinFilterParameters,
  "ratioDeltaBeta"
> & {
  ratioDeltaBeta: SweepParameters;
};

type I13180PipelineParameterConfig = {
  pipelineType: PipelineType;
  config: I13180PaganinPipelineParameterConfig | I13180PipelineParameterConfig;
};

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
        paganin: PaganinFilterSweepParameters;
        recon: { center: number };
      };
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

const DEFAULT_CENTERING_180_AUTO_PARAMETER_VALUES = {
  smin: -50,
  smax: 50,
};

const DEFAULT_CENTERING_180_SWEEP_PARAMETER_VALUES = {
  loader: {
    start: 589,
    stop: 599,
  },
  center: {
    start: 1180,
    stop: 1380,
    step: 2.0,
  },
};

const DEFAULT_CENTERING_180_FIXED_PARAMETER_VALUES = {
  center: 1280,
};

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

type I13180AbsorptionPipelineConfigurationComponentProps =
  I13180PipelineConfigurationComponentProps & {
    magnification: typeof Magnification;
  };

const I13180AbsorptionPipelineConfigurationComponent: React.FC<
  I13180AbsorptionPipelineConfigurationComponentProps
> = ({ magnification, visitDirpath, setParameters }) => {
  const [pipelineParameterConfig, setPipelineParameterConfig] =
    useState<I13180AbsorptionPipelineParameterConfig>({
      centeringMode: CenteringMode.Auto,
      parameters: DEFAULT_CENTERING_180_AUTO_PARAMETER_VALUES,
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

    if (pipelineParameterConfig.centeringMode === CenteringMode.Sweep) {
      pipeline[0]["parameters"]["preview"] = {
        detector_y: pipelineParameterConfig.parameters.loader,
      };
    }

    if (pipelineParameterConfig.centeringMode === CenteringMode.Auto) {
      pipeline.push({
        method: "find_center_vo",
        module_path: "httomolibgpu.recon.rotation",
        parameters: {
          ind: null,
          average_radius: 0,
          cor_initialisation_value: null,
          smin: pipelineParameterConfig.parameters.smin,
          smax: pipelineParameterConfig.parameters.smax,
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

    // TODO: handle paganin pipeline type case

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

    if (pipelineParameterConfig.centeringMode === CenteringMode.Auto) {
      pipeline.push(
        generateReconMethod("${{centering.side_outputs.centre_of_rotation}}")
      );
    } else if (pipelineParameterConfig.type === CenteringMode.Sweep) {
      pipeline.push(
        generateReconMethod({
          start: pipelineParameterConfig.parameters.center.start,
          stop: pipelineParameterConfig.parameters.center.stop,
          step: pipelineParameterConfig.parameters.center.step,
        })
      );
    } else {
      pipeline.push(
        generateReconMethod(pipelineParameterConfig.parameters.center)
      );
    }

    if (pipelineParameterConfig.centeringMode !== CenteringMode.Sweep) {
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

    return pipeline;
  };

  useEffect(() => {
    setParameters({
      config: generatePipeline(),
    });
  }, [magnification, pipelineParameterConfig]);

  const displayPipelineParameterConfigurator = () => {
    switch (pipelineParameterConfig.centeringMode) {
      case "Auto":
        return (
          <Centering180ParameterConfiguration
            parameters={pipelineParameterConfig.parameters}
            setParameters={(params) =>
              setPipelineParameterConfig({
                centeringMode: CenteringMode.Auto,
                parameters: params,
              })
            }
          />
        );
      case "Sweep":
        return (
          <>
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
            <ParameterSweepConfiguration
              parameters={pipelineParameterConfig.parameters.center}
              setParameters={(params) =>
                setPipelineParameterConfig({
                  ...pipelineParameterConfig,
                  parameters: {
                    ...pipelineParameterConfig.parameters,
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
            value={pipelineParameterConfig.parameters.center}
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

  return (
    <>
      <Stack direction="row" spacing={2} display="flex" alignItems="center">
        <Stack direction="row" spacing={2} display="flex" alignItems="center">
          <Typography>Centering</Typography>
          <ToggleButtonGroup
            exclusive
            value={pipelineParameterConfig.centeringMode}
            aria-label="i13-centering-mode-toggle"
            onChange={(
              _: React.MouseEvent<HTMLElement>,
              newValue: string | null
            ) => {
              if (newValue) {
                if (newValue === "Auto") {
                  setPipelineParameterConfig({
                    centeringMode: CenteringMode.Auto,
                    parameters: DEFAULT_CENTERING_180_AUTO_PARAMETER_VALUES,
                  });
                } else if (newValue === "Sweep") {
                  setPipelineParameterConfig({
                    centeringMode: CenteringMode.Sweep,
                    parameters: DEFAULT_CENTERING_180_SWEEP_PARAMETER_VALUES,
                  });
                } else {
                  setPipelineParameterConfig({
                    centeringMode: CenteringMode.Fixed,
                    parameters: DEFAULT_CENTERING_180_FIXED_PARAMETER_VALUES,
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

const I13180PaganinPipelineConfigurationComponent: React.FC<
  I13180AbsorptionPipelineConfigurationComponentProps
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
      {pipelineParameterConfig.paganinMode === PaganinMode.Sweep && (
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
