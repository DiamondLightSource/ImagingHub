import { useEffect, useState } from "react";
import { Card, InputAdornment, TextField, Typography } from "@mui/material";
import { TemplateComponentProps } from "../../../types";
import Loader from "../../../../../tomography/src/components/loader/Loader";
import { useLoader } from "../../../../../tomography/src/contexts/LoaderContext";
import {
  Centering180Parameters,
  Centering360Parameters,
  CenteringMethodType,
  CenteringParameterConfiguration,
  DistortionCorrectionParameterConfiguration,
  DistortionCorrectionParameters,
  PaganinFilterParameterConfiguration,
  PaganinFilterParameters,
  StripeRemovalParameterConfiguration,
  StripeRemovalParameters,
} from "./methodComponents";

export const I12ParameterConfiguration: React.FC<TemplateComponentProps> = ({
  setParameters,
  visitDirpath,
}: TemplateComponentProps) => {
  const [applyDistortionCorrection, setApplyDistortionCorrection] =
    useState<boolean>(false);
  const [distortionCorrectionParameters, setDistortionCorrectionParameters] =
    useState<DistortionCorrectionParameters>({ coefficientsFilepath: "" });
  const [applyStripeRemoval, setApplyStripeRemoval] = useState<boolean>(true);
  const [stripeRemovalParameters, setStripeRemovalParameters] =
    useState<StripeRemovalParameters>({
      snr: 3,
      laSize: 61,
      smSize: 21,
    });
  const [centeringMethodType, setCenteringMethodType] =
    useState<CenteringMethodType>(CenteringMethodType[180]);
  const [centeringMethodParameters, setCenteringMethodParameters] = useState<
    Centering180Parameters | Centering360Parameters
  >({
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
    ];

    const stripeRemovalMethod = {
      method: "remove_all_stripe",
      module_path: "httomolibgpu.prep.stripe",
      parameters: {
        snr: stripeRemovalParameters.snr,
        la_size: stripeRemovalParameters.laSize,
        sm_size: stripeRemovalParameters.smSize,
      },
    };

    const distortionCorrectionMethod = {
      method: "distortion_correction_proj_discorpy",
      module_path: "httomolibgpu.prep.alignment",
      parameters: {
        metadata_path: distortionCorrectionParameters.coefficientsFilepath,
      },
    };

    const paganinFilterMethod = {
      method: "paganin_filter",
      module_path: "httomolibgpu.prep.phase",
      parameters: {
        pixel_size: paganinFilterParameters.pixelSize,
        distance: paganinFilterParameters.distance,
        energy: paganinFilterParameters.energy,
        ratio_delta_beta: paganinFilterParameters.ratioDeltaBeta,
      },
    };

    const reconMethod = {
      method: "FBP3d_tomobar",
      module_path: "httomolibgpu.recon.algorithm",
      parameters: {},
    };

    if (applyDistortionCorrection) {
      pipeline.push(distortionCorrectionMethod);
      return pipeline;
    }

    if (applyStripeRemoval) {
      pipeline.push(stripeRemovalMethod);
    }

    if (centeringMethodType === CenteringMethodType[180]) {
      pipeline.push({
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
      });
    } else {
      pipeline.push({
        method: "find_center_vo",
        module_path: "httomolibgpu.recon.rotation",
        parameters: {
          side: centeringMethodParameters.side,
          win_width: centeringMethodParameters.winWidth,
        },
        id: "centering",
        side_outputs: {
          cor: "centre_of_rotation",
          overlap: "overlap",
          side: "side",
          overlap_position: "overlap_position",
        },
      });
    }

    pipeline.push(paganinFilterMethod);
    pipeline.push(reconMethod);

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
    applyDistortionCorrection,
    distortionCorrectionParameters,
    applyStripeRemoval,
    stripeRemovalParameters,
    centeringMethodType,
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
        <DistortionCorrectionParameterConfiguration
          active={applyDistortionCorrection}
          setActive={setApplyDistortionCorrection}
          parameters={distortionCorrectionParameters}
          setParameters={setDistortionCorrectionParameters}
        />
        {!applyDistortionCorrection && (
          <>
            <StripeRemovalParameterConfiguration
              active={applyStripeRemoval}
              setActive={setApplyStripeRemoval}
              parameters={stripeRemovalParameters}
              setParameters={setStripeRemovalParameters}
            />
            <CenteringParameterConfiguration
              methodType={centeringMethodType}
              setMethodType={setCenteringMethodType}
              parameters={centeringMethodParameters}
              setParameters={setCenteringMethodParameters}
            />
            <PaganinFilterParameterConfiguration
              parameters={paganinFilterParameters}
              setParameters={setPaganinFilterParameters}
            />
          </>
        )}
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
