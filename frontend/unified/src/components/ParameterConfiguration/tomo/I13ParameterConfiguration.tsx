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
  OutputFolderConfiguration,
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
  parameters: { loader: MinimalLoaderPreviewParameters; cor: SweepParameters };
};

type I13180FixedPipelineParameterConfig = {
  type: typeof CenteringMode.Fixed;
  parameters: { cor: number };
};

type I13180PipelineParameters =
  | I13180AutoPipelineParameterConfig
  | I13180SweepPipelineParameterConfig
  | I13180FixedPipelineParameterConfig;

const DEFAULT_CENTERING_180_AUTO_PARAMETER_VALUES = {
  smin: -50,
  smax: 50,
};

const DEFAULT_CENTERING_180_SWEEP_PARAMETER_VALUES = {
  loader: {
    start: 589,
    stop: 599,
  },
  cor: {
    start: 1180,
    stop: 1380,
    step: 2.0,
  },
};

const DEFAULT_CENTERING_180_FIXED_PARAMETER_VALUES = {
  cor: 1280,
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

type I13180PipelineConfigurationComponentProps = {
  visitDirpath: string;
  outputFolder: string;
  setOutputFolder: string;
};

const I13180PipelineConfigurationComponent: React.FC<
  I13180PipelineConfigurationComponentProps
> = ({ visitDirpath, outputFolder, setOutputFolder }) => {
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

    if (pipelineParameterConfig.type === CenteringMode.Sweep) {
      pipeline[0]["parameters"]["preview"] = {
        detector_y: pipelineParameterConfig.parameters.loader,
      };
    }

    if (pipelineParameterConfig.type === CenteringMode.Auto) {
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

    const generateReconMethod = (cor: number | string | SweepParameters) => {
      return {
        method: "FBP3d_tomobar",
        module_path: "httomolibgpu.recon.algorithm",
        parameters: {
          center: cor,
          detector_pad: false,
          filter_freq_cutoff: 0.35,
          recon_size: null,
          recon_mask_radius: 0.95,
        },
        save_result: false,
      };
    };

    if (pipelineParameterConfig.type === CenteringMode.Auto) {
      pipeline.push(
        generateReconMethod("${{centering.side_outputs.centre_of_rotation}}")
      );
    } else if (pipelineParameterConfig.type === CenteringMode.Sweep) {
      pipeline.push(
        generateReconMethod({
          start: pipelineParameterConfig.parameters.cor.start,
          stop: pipelineParameterConfig.parameters.cor.stop,
          step: pipelineParameterConfig.parameters.cor.step,
        })
      );
    } else {
      pipeline.push(
        generateReconMethod(pipelineParameterConfig.parameters.cor)
      );
    }

    if (pipelineParameterConfig.type !== CenteringMode.Sweep) {
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
              parameters={pipelineParameterConfig.parameters.cor}
              setParameters={(params) =>
                setPipelineParameterConfig({
                  ...pipelineParameterConfig,
                  parameters: {
                    ...pipelineParameterConfig.parameters,
                    cor: params,
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
      <OutputFolderConfiguration
        visitDirpath={visitDirpath}
        outputFolder={outputFolder}
        setOutputFolder={setOutputFolder}
      />
    </>
  );
};
