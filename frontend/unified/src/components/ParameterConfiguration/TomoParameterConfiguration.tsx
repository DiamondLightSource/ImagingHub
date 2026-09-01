import {
  Card,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { TemplateComponentProps } from "../../types";
import Loader from "../../../../tomography/src/components/loader/Loader";
import { useLoader } from "../../../../tomography/src/contexts/LoaderContext";
import ParameterSweepForm from "../../../../tomography/src/components/workflows/sweepPipeline/ParameterSweepForm";

const HTTOMO_OUTDIR_NAME = "sweep-run";

export const CorSweepParameterConfiguration = ({
  setParameters,
}: TemplateComponentProps) => {
  const [applyNormalisation, setApplyNormalisation] = useState<boolean>(true);
  const [sweepValues, setSweepValues] = useState({
    start: 0,
    stop: 10,
    step: 1,
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
        method: "recon",
        module_path: "tomopy.recon.algorithm",
        parameters: {
          center: sweepValues,
          sinogram_order: false,
          algorithm: "gridrec",
          init_recon: null,
        },
      },
    ];

    const normalisationMethods = [
      {
        method: "normalize",
        module_path: "tomopy.prep.normalize",
        parameters: { cutoff: null, averaging: "mean" },
      },
      {
        method: "minus_log",
        module_path: "tomopy.prep.normalize",
        parameters: {},
      },
    ];

    if (applyNormalisation) {
      pipeline = [pipeline[0], ...normalisationMethods, pipeline[1]];
    }

    return pipeline;
  };

  useEffect(() => {
    setParameters({
      config: generatePipeline(),
      "httomo-outdir-name": HTTOMO_OUTDIR_NAME,
      output: outputFolder,
    });
  }, [applyNormalisation, sweepValues, outputFolder]);

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
          <strong>Sweep configuration</strong>
        </Typography>
        <ParameterSweepForm values={sweepValues} onChange={setSweepValues} />
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
            label="Apply normalisation to raw data"
            control={
              <Checkbox
                checked={applyNormalisation}
                onChange={(e) => setApplyNormalisation(e.target.checked)}
              />
            }
          />
        </FormGroup>
        <TextField
          variant="outlined"
          size="small"
          label="Output folder"
          value={outputFolder}
          onChange={(e) => setOutputFolder(e.target.value)}
        />
      </Card>
    </>
  );
};
