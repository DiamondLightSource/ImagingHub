import { useEffect, useState } from "react";
import { Card, Stack, Typography } from "@mui/material";
import { TemplateComponentProps } from "../../../types";
import Loader from "../../../../../tomography/src/components/loader/Loader";
import { useLoader } from "../../../../../tomography/src/contexts/LoaderContext";
import {
  Centering180ParameterConfiguration,
  Centering180Parameters,
  OutputFolderConfiguration,
  PaganinFilterParameters,
  StripeRemovalParameterConfiguration,
  StripeRemovalParameters,
  ToggleablePaganinFilterParameterConfiguration,
} from "./methodComponents";

export const K11ParameterConfiguration: React.FC<TemplateComponentProps> = ({
  setParameters,
  visitDirpath,
}: TemplateComponentProps) => {
  const [applyPaganinFilter, setApplyPaganinFilter] = useState<boolean>(false);
  const [applyStripeRemoval, setApplyStripeRemoval] = useState<boolean>(true);
  const [stripeRemovalParameters, setStripeRemovalParameters] =
    useState<StripeRemovalParameters>({
      snr: 3,
      laSize: 61,
      smSize: 21,
    });
  const [centeringMethodParameters, setCenteringMethodParameters] =
    useState<Centering180Parameters>({
      smin: -50,
      smax: 50,
    });
  const [paganinFilterParameters, setPaganinFilterParameters] =
    useState<PaganinFilterParameters>({
      pixelSize: 1.28,
      distance: 1.0,
      energy: 53.0,
      ratioDeltaBeta: 250,
    });
  const [outputFolder, setOutputFolder] = useState<string>("");

  const {
    method: loaderMethod,
    module_path: loaderModulePath,
    parameters: loaderParams,
  } = useLoader();

  const generatePipeline = () => {
    const pipeline = [
      {
        method: loaderMethod,
        module_path: loaderModulePath,
        parameters: loaderParams,
      },
      {
        method: "dark_flat_field_correction",
        module_path: "httomolibgpu.prep.normalize",
        parameters: {},
      },
      {
        method: "find_center_vo",
        module_path: "httomolibgpu.recon.rotation",
        parameters: {
          smin: centeringMethodParameters.smin,
          smax: centeringMethodParameters.smax,
        },
        id: "centering",
        side_outputs: {
          cor: "centre_of_rotation",
        },
      },
    ];

    if (applyStripeRemoval) {
      pipeline.push({
        method: "remove_all_stripe",
        module_path: "httomolibgpu.prep.stripe",
        parameters: {
          snr: stripeRemovalParameters.snr,
          la_size: stripeRemovalParameters.laSize,
          sm_size: stripeRemovalParameters.smSize,
        },
      });
    }

    if (applyPaganinFilter) {
      pipeline.push({
        method: "paganin_filter",
        module_path: "httomolibgpu.prep.phase",
        parameters: {
          pixel_size: paganinFilterParameters.pixelSize,
          distance: paganinFilterParameters.distance,
          energy: paganinFilterParameters.energy,
          ratio_delta_beta: paganinFilterParameters.ratioDeltaBeta,
        },
      });
    } else {
      pipeline.push({
        method: "minus_log",
        module_path: "httomolibgpu.prep.normalize",
        parameters: {},
      });
    }

    pipeline.push(
      {
        method: "FBP3d_tomobar",
        module_path: "httomolibgpu.recon.algorithm",
        parameters: {},
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
  }, [
    loaderParams,
    applyPaganinFilter,
    applyStripeRemoval,
    stripeRemovalParameters,
    centeringMethodParameters,
    paganinFilterParameters,
    outputFolder,
  ]);

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
        <Card variant="outlined" sx={{ padding: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography gutterBottom>Centering</Typography>
            <Centering180ParameterConfiguration
              parameters={centeringMethodParameters}
              setParameters={setCenteringMethodParameters}
            />
          </Stack>
        </Card>
        <StripeRemovalParameterConfiguration
          active={applyStripeRemoval}
          setActive={setApplyStripeRemoval}
          parameters={stripeRemovalParameters}
          setParameters={setStripeRemovalParameters}
        />
        <ToggleablePaganinFilterParameterConfiguration
          toggleable={{
            active: applyPaganinFilter,
            setActive: setApplyPaganinFilter,
          }}
          parameters={paganinFilterParameters}
          setParameters={setPaganinFilterParameters}
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
        <Typography gutterBottom variant="h6" color="primary">
          <strong>Output</strong>
        </Typography>
        <OutputFolderConfiguration
          visitDirpath={visitDirpath}
          outputFolder={outputFolder}
          setOutputFolder={setOutputFolder}
        />
      </Card>
    </>
  );
};
