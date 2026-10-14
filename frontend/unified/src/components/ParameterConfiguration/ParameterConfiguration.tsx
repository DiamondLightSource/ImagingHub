import { Alert, Button, Snackbar, Typography } from "@mui/material";
import { Beamline, Technique } from "../../types";
import { SUBMIT_WORKFLOW_TEMPLATE } from "../../../../tomography/src/components/workflows/Submission";
import { useMutation } from "@apollo/client/react";
import { Visit } from "@diamondlightsource/sci-react-ui";
import { InstrumentSession } from "../SessionSelector";
import TemplateSelector from "../ProcessingView/TemplateSelector";
import { templateOptions } from "../../data/templates";
import { getParamConfigComponent } from "./utils/getParamConfigComponent";
import { useState } from "react";
import {
  determineBeamlineRawDataFilepath,
  determineBeamlineVisitDirpath,
} from "./utils/utils";

type ParameterConfigurationProps = {
  technique: Technique;
  visit: Visit;
  beamline: Beamline;
  startTime: InstrumentSession["startTime"];
  scanIds: number[];
};

export const ParameterConfiguration: React.FC<ParameterConfigurationProps> = ({
  technique,
  visit,
  beamline,
  startTime,
  scanIds,
}: ParameterConfigurationProps) => {
  const templateList = templateOptions.filter((option) =>
    option.value.includes(technique.toLowerCase())
  );
  const [template, setTemplate] = useState<string | null>(
    templateList[0]?.value ?? null
  );
  const [templateParameters, setTemplateParameters] = useState<object>({});
  const [resourceParameters, setResourceParameters] = useState({
    nprocs: 1,
    memory: "20Gi",
  });
  const [notification, setNotification] = useState<
    React.ReactElement | undefined
  >(undefined);

  const [mutation] = useMutation(SUBMIT_WORKFLOW_TEMPLATE);

  const sessionYear = new Date(startTime).getFullYear();
  const visitDirpath = determineBeamlineVisitDirpath(
    beamline,
    sessionYear,
    visit
  );
  const rawDataFilepath = determineBeamlineRawDataFilepath(
    beamline,
    visitDirpath,
    scanIds[0]
  );

  const handleSubmitJob = () => {
    // TODO: Validate parameters against JSON schema attached to the workflow template before
    // sending the mutation
    console.log("Submit job");
    const parameters = {
      ...templateParameters,
      ...resourceParameters,
    };
    if (template.includes("httomo")) {
      parameters["input"] = rawDataFilepath;
    }
    mutation({
      variables: {
        name: template,
        parameters,
        visit: visit,
      },
      onCompleted: (resp) => {
        setNotification(
          <Alert severity="success" variant="outlined">
            Submitted workflow: {resp.submitWorkflowTemplate.name}
          </Alert>
        );
      },
      onError: (err) => {
        setNotification(
          <Alert severity="error" variant="outlined">
            Failed to submit workflow: {err.message}
          </Alert>
        );
      },
    });
    setNotification(
      <Alert severity="info" variant="outlined">
        Submitting workflow...
      </Alert>
    );
  };

  const PlaceholderComponent = (
    <p>No available component for {template} template</p>
  );

  const parameterConfigurationComponent = template
    ? getParamConfigComponent(
        technique,
        template,
        setTemplateParameters,
        setResourceParameters,
        scanIds,
        visitDirpath
      )
    : null;

  return (
    <>
      {template ? (
        <>
          <TemplateSelector
            templateList={templateList}
            template={template}
            setTemplate={setTemplate}
          />
          <Typography variant="h6">Options</Typography>
          {parameterConfigurationComponent ?? PlaceholderComponent}
          <Button
            disabled={!parameterConfigurationComponent}
            variant="contained"
            color="primary"
            onClick={handleSubmitJob}
          >
            Submit job
          </Button>
        </>
      ) : (
        <p>No templates found</p>
      )}

      <Snackbar
        open={notification !== undefined}
        autoHideDuration={6000}
        onClose={() => setNotification(undefined)}
        children={notification}
      />
    </>
  );
};
