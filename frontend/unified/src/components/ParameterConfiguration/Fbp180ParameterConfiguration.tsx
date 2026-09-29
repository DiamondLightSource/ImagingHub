import {
  Card,
  Checkbox,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Loader from "../../../../tomography/src/components/loader/Loader";
import { useLoader } from "../../../../tomography/src/contexts/LoaderContext";
import { TemplateComponentProps } from "../../types";
import { useEffect, useState } from "react";

export const Fbp180ParameterConfiguration: React.FC<TemplateComponentProps> = ({
  setParameters,
  setResourceParameters,
  visitDirpath,
}: TemplateComponentProps) => {
  const [applyStripeRemoval, setApplyStripeRemoval] = useState<boolean>(true);
  const [stripeRemovalParameters, setStripeRemovalParameters] =
    useState<StripeRemovalParameters>({
      snr: 3,
      laSize: 61,
      smSize: 21,
    });
  const [outputFolder, setOutputFolder] = useState<string>("");

  const {
    method: loaderMethod,
    module_path: loaderModulePath,
    parameters: loaderParams,
  } = useLoader();

  const generatePipeline = () => {
    let pipeline = [
      {
        method: loaderMethod,
        module_path: loaderModulePath,
        parameters: loaderParams,
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
      {
        method: "FBP3d_tomobar",
        module_path: "httomolibgpu.recon.algorithm",
        parameters: {
          center: "${{centering.side_outputs.centre_of_rotation}}",
          detector_pad: false,
          filter_freq_cutoff: 0.35,
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

    const stripeRemovalMethod = [
      {
        method: "removal_all_stripe",
        module_path: "httomolibgpu.prep.stripe",
        parameters: {
          snr: stripeRemovalParameters.snr,
          la_size: stripeRemovalParameters.laSize,
          sm_size: stripeRemovalParameters.smSize,
        },
      },
    ];

    if (applyStripeRemoval) {
      pipeline = pipeline
        .slice(0, 4)
        .concat(stripeRemovalMethod)
        .concat(pipeline.slice(4, pipeline.length + 1));
    }

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
      memory: "200Gi",
    });
  }, [applyStripeRemoval, stripeRemovalParameters, outputFolder]);

  return (
    <>
      <Loader />
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
  );
};
