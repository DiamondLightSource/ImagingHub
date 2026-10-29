import { useState } from "react";
import {
  Divider,
  Snackbar,
  Stack,
  Typography,
  useTheme,
  Alert,
} from "@mui/material";
import { Ajv } from "ajv";
import { JSONObject } from "../../types";
import {
  Visit,
  VisitInput,
  visitToText,
} from "@diamondlightsource/sci-react-ui";
import Loader from "../loader/Loader";
import { useLoader } from "../../contexts/LoaderContext";
import { useMethods } from "../../contexts/MethodsContext";
import WorkflowStatus from "./WorkflowStatus";
import { useHTTOMOConfig } from "../../hooks/useHTTOMOConfig";
import React from "react";

import { GpuJobWorkflowParametersForm } from "./GpuJobWorkflowParametersForm";
import { type WorkflowTemplateQuery } from "./__generated__/Submission.generated";

const SubmissionFormGPURun = (props: {
  template: WorkflowTemplateQuery["workflowTemplate"];
  prepopulatedParameters?: JSONObject;
  visit?: Visit;
  onSubmit: (
    visit: Visit,
    parameters: object,
    onSuccess?: (workflowName: string) => void
  ) => void;
}) => {
  const theme = useTheme();
  const {
    method,
    module_path,
    parameters: loaderParams,
    isContextValid,
    setDataPath,
    setImageKeyPath,
    setRotationAnglesDataPath,
  } = useLoader();
  const { methods } = useMethods();
  const { generateHTTOMOConfig, hasLoaderData, hasMethodsData } =
    useHTTOMOConfig();

  const [inputPath, setInputPath] = useState("");
  const [outputPath, setOutputPath] = useState("");
  const [nProcs, setNProcs] = useState(
    Number(props.template.arguments.properties.nprocs.default)
  );
  const [memory, setMemory] = useState(
    props.template.arguments.properties.memory.default
  );
  const [isInputPathValid, setIsInputPathValid] = useState(false);
  const [isOutputPathValid, setIsOutputPathValid] = useState(false);
  const [isNProcsValid, setIsNProcsValid] = useState(true);
  const [isMemoryValid, setIsMemoryValid] = useState(true);

  const [submitted, setSubmitted] = useState(false);
  const [submittedWorkflowName, setSubmittedWorkflowName] = useState<
    string | null
  >(null);
  const [submittedVisit, setSubmittedVisit] = useState<Visit | null>(null); // Add this

  const generateConfigJSON = () => {
    const combinedData = generateHTTOMOConfig();
    return JSON.stringify(combinedData);
  };

  const validator = new Ajv().compile(props.template.arguments);

  const onClick = (visit: Visit, _?: object) => {
    if (
      isInputPathValid &&
      isOutputPathValid &&
      isNProcsValid &&
      isMemoryValid
    ) {
      const configJSON = generateConfigJSON();

      console.log("Generated config JSON for httomo-gpu-job:", configJSON);

      const finalParams = {
        config: configJSON,
        input: inputPath,
        output: outputPath,
        nprocs: nProcs.toString(),
        memory: memory,
      };

      const validationRes = validator(finalParams);
      if (!validationRes) {
        console.error("Parameter validation failed: ", validator.errors);
        return;
      }

      props.onSubmit(visit, finalParams, (workflowName: string) => {
        console.log("SUCCESS CALLBACK RECEIVED:", workflowName);
        setSubmittedWorkflowName(workflowName);
        setSubmittedVisit(visit); // Capture the visit from the form
      });

      setSubmitted(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSubmitted(false);
  };

  const formWidth =
    (props.template.uiSchema?.options?.formWidth as string | undefined) ??
    "100%";

  return (
    <Stack
      direction="column"
      spacing={theme.spacing(2)}
      sx={{ width: formWidth }}
    >
      <Typography variant="h4" align="center">
        Workflow:{" "}
        {props.template.title ? props.template.title : props.template.name}
      </Typography>
      <Typography variant="body1" align="center">
        {props.template.description}
      </Typography>

      <Divider />

      <GpuJobWorkflowParametersForm
        inputPath={inputPath}
        isInputPathValid={isInputPathValid}
        outputPath={outputPath}
        isOutputPathValid={isOutputPathValid}
        nProcs={nProcs}
        isNProcsValid={isNProcsValid}
        memory={memory}
        isMemoryValid={isMemoryValid}
        handleInputPathChange={(input: string) => setInputPath(input)}
        handleIsInputPathValidChange={(isValid: boolean) =>
          setIsInputPathValid(isValid)
        }
        handleOutputPathChange={(output: string) => setOutputPath(output)}
        handleIsOutputPathValidChange={(isValid: boolean) =>
          setIsOutputPathValid(isValid)
        }
        handleNProcsChange={(nProcs: number) => setNProcs(nProcs)}
        handleIsNProcsValidChange={(isValid: boolean) =>
          setIsNProcsValid(isValid)
        }
        handleMemoryChange={(memory: string) => setMemory(memory)}
        handleIsMemoryValidChange={(isValid: boolean) =>
          setIsMemoryValid(isValid)
        }
      />

      <Divider />

      <Loader />

      {submittedWorkflowName && submittedVisit && (
        <WorkflowStatus
          workflow={submittedWorkflowName}
          visit={visitToText(submittedVisit)} // Use the captured visit
        />
      )}

      {!hasLoaderData && (
        <Alert severity="info">
          Some Loader fields are empty. They will be auto-filled with default
          values during submission.
        </Alert>
      )}

      {!hasMethodsData && (
        <Alert severity="info">
          No methods configured. Please add methods in the Methods section to
          create a complete pipeline.
        </Alert>
      )}

      <Divider />

      <VisitInput
        visit={props.visit}
        onSubmit={onClick}
        submitOnReturn={false}
      />

      <Snackbar
        open={submitted}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="Workflow submitted!"
      />
    </Stack>
  );
};

export default SubmissionFormGPURun;
