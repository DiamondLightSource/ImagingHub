import {
  Card,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { TemplateComponentProps } from "../../../types";
import { useEffect, useState } from "react";

export const SyntheticDataParameterConfiguration: React.FC<
  TemplateComponentProps
> = ({
  setParameters,
  setResourceParameters,
  visitDirpath,
}: TemplateComponentProps) => {
  const [loaderPreview, setLoaderPreview] =
    useState<MinimalLoaderPreviewParameters>({
      start: 100,
      stop: 110,
    });
  const [applyRemoveOutlier, setApplyRemoveOutlier] = useState<boolean>(true);
  const [removeOutlierParameters, setRemoveOutlierParameters] =
    useState<RemoveOutlierParameters>({
      kernel: REMOVE_OUTLIER_KERNEL_VALUES[0],
    });
  const [applyStripeRemoval, setApplyStripeRemoval] = useState<boolean>(true);
  const [stripeRemovalParameters, setStripeRemovalParameters] =
    useState<StripeRemovalParameters>({
      snr: 3,
      laSize: 61,
      smSize: 21,
    });
  const [outputFolder, setOutputFolder] = useState<string>("");

  const generatePipeline = () => {
    const pipeline = [
      {
        method: "standard_tomo",
        module_path: "httomo.data.hdf.loaders",
        parameters: {
          data_path: "auto",
          image_key_path: "auto",
          rotation_angles: "auto",
          preview: loaderPreview,
        },
      },
    ];

    const methodsAfterRemoveOutlier = [
      {
        method: "dark_flat_field_correction",
        module_path: "httomolibgpu.prep.normalize",
        parameters: {
          flats_multiplier: 1,
          darks_multiplier: 1,
          upper_bound: null,
          lower_bound: null,
          clipping_warning: false,
        },
      },
      {
        method: "find_center_vo",
        module_path: "httomolibgpu.recon.rotation",
        parameters: {
          ind: null,
          average_radius: 0,
          cor_initialisation_value: null,
          smin: -50,
          smax: 50,
          srad: 6,
          step: 0.5,
          ratio: 0.5,
          drop: 20,
        },
        id: "centering",
        side_outputs: {
          cor: "centre_of_rotation",
        },
      },
      {
        method: "minus_log",
        module_path: "httomolibgpu.prep.normalize",
        parameters: {},
      },
    ];

    const methodsAfterStripeRemoval = [
      {
        method: "LPRec3d_tomobar",
        module_path: "httomolibgpu.recon.algorithm",
        parameters: {
          center: null,
          detector_pad: false,
          filter_type: "shepp",
          filter_freq_cutoff: 1,
          recon_size: null,
          recon_mask_radius: 0.95,
        },
      },
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
          perc_range_min: 0,
          perc_range_max: 100,
          bits: 8,
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
      },
    ];

    const removeOutlierMethod = {
      method: "remove_outlier",
      module_path: "httomolibgpu.misc.corr",
      parameters: {
        kernel_size: removeOutlierParameters.kernel,
        dif: 1000,
      },
    };

    const stripeRemovalMethod = {
      method: "remove_all_stripe",
      module_path: "httomolibgpu.prep.stripe",
      parameters: {
        snr: stripeRemovalParameters.snr,
        la_size: stripeRemovalParameters.laSize,
        sm_size: stripeRemovalParameters.smSize,
      },
    };

    if (applyRemoveOutlier) {
      pipeline.push(removeOutlierMethod);
    }

    pipeline.push(...methodsAfterRemoveOutlier);

    if (applyStripeRemoval) {
      pipeline.push(stripeRemovalMethod);
    }

    pipeline.push(...methodsAfterStripeRemoval);

    return pipeline;
  };

  useEffect(() => {
    const date = new Date();
    const httomoOutdirName = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}_output`;
    setParameters({
      config: generatePipeline(),
      output: visitDirpath + outputFolder,
      "httomo-outdir-name": httomoOutdirName,
    });
    setResourceParameters({
      nprocs: 4,
      memory: "20Gi",
    });
  }, [
    loaderPreview,
    applyRemoveOutlier,
    removeOutlierParameters,
    applyStripeRemoval,
    stripeRemovalParameters,
    outputFolder,
  ]);

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          mb: 2,
          p: 2,
          border: "1px solid #89987880",
          borderRadius: "4px",
        }}
      >
        <Typography
          gutterBottom
          variant="h6"
          color="primary"
          component="div"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <strong>Loader</strong>
        </Typography>
        <Typography gutterBottom>Detector Y preview</Typography>
        <LoaderParameterConfiguration
          parameters={loaderPreview}
          setParameters={setLoaderPreview}
        />
      </Card>
      <Card
        variant="outlined"
        sx={{
          mb: 2,
          p: 2,
          border: "1px solid #89987880",
          borderRadius: "4px",
        }}
      >
        <Typography
          gutterBottom
          variant="h6"
          color="primary"
          component="div"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <strong>Pipeline configuration</strong>
        </Typography>
        <FormGroup>
          <FormControlLabel
            label="Apply outlier removal"
            control={
              <Checkbox
                checked={applyRemoveOutlier}
                onChange={(e) => setApplyRemoveOutlier(e.target.checked)}
              />
            }
          />
          {applyRemoveOutlier && (
            <RemoveOutlierParameterConfiguration
              parameters={removeOutlierParameters}
              setParameters={setRemoveOutlierParameters}
            />
          )}
        </FormGroup>
        <FormGroup sx={{ marginBottom: 2 }}>
          <FormControlLabel
            label="Apply stripe removal"
            control={
              <Checkbox
                checked={applyStripeRemoval}
                onChange={(e) => setApplyStripeRemoval(e.target.checked)}
              />
            }
          />
          {applyStripeRemoval && (
            <StripeRemovalParameterConfiguration
              parameters={stripeRemovalParameters}
              setParameters={setStripeRemovalParameters}
            />
          )}
        </FormGroup>
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
      </Card>
    </>
  );
};

type StripeRemovalParameters = {
  snr: number;
  laSize: number;
  smSize: number;
};

type StripeRemovalParameterConfigurationProps = {
  parameters: StripeRemovalParameters;
  setParameters: (_: StripeRemovalParameters) => void;
};

const StripeRemovalParameterConfiguration: React.FC<
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
  );
};

const REMOVE_OUTLIER_KERNEL_VALUES = [3, 5, 7, 9, 11, 13];

type RemoveOutlierParameters = {
  kernel: number;
};

type RemoveOutlierParameterConfigurationProps = {
  parameters: RemoveOutlierParameters;
  setParameters: (_: RemoveOutlierParameters) => void;
};

const RemoveOutlierParameterConfiguration: React.FC<
  RemoveOutlierParameterConfigurationProps
> = ({
  parameters,
  setParameters,
}: RemoveOutlierParameterConfigurationProps) => {
  return (
    <FormControl>
      <InputLabel id="template-selector-label">Kernel size</InputLabel>
      <Select
        value={String(parameters.kernel)}
        aria-label="Kernel size"
        label="Kernel size"
        size="small"
        onChange={(event: SelectChangeEvent) =>
          setParameters({ kernel: Number(event.target.value) })
        }
      >
        {REMOVE_OUTLIER_KERNEL_VALUES.map((value) => (
          <MenuItem key={value} value={value}>
            {value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

type MinimalLoaderPreviewParameters = {
  start: number;
  stop: number;
};

type LoaderParameterConfigurationProps = {
  parameters: MinimalLoaderPreviewParameters;
  setParameters: (_: MinimalLoaderPreviewParameters) => void;
};

const LoaderParameterConfiguration: React.FC<
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
