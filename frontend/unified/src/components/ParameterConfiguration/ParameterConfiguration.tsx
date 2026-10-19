import { Alert, Button, Snackbar, Typography } from "@mui/material";
import { Beamline, Technique } from "../../types";
import { SUBMIT_WORKFLOW_TEMPLATE } from "../../../../tomography/src/components/workflows/Submission";
import { useMutation, useSuspenseQuery } from "@apollo/client/react";
import { Visit } from "@diamondlightsource/sci-react-ui";
import { InstrumentSession } from "../SessionSelector";
import TemplateSelector from "../ProcessingView/TemplateSelector";
import { getParamConfigComponent } from "./utils/getParamConfigComponent";
import { useState } from "react";
import {
  determineBeamlineRawDataFilepath,
  determineBeamlineVisitDirpath,
} from "./utils/utils";
import { PARAMETERCONFIGURATION_QUERY } from "../../graphql/ParameterConfigurationQuery";

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
  const { data, error } = useSuspenseQuery(PARAMETERCONFIGURATION_QUERY);
  const templateList = data.workflowTemplates.nodes.filter((t) =>
    t.name.startsWith(technique.toLowerCase())
  );
  const [template, setTemplate] = useState<string | null>(
    templateList.length > 0 ? templateList[0].name : null
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

  if (error) console.error(`Error: ${error.message}`);

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
      scanId: scanIds[0],
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

  const parameterConfigurationComponent = template
    ? getParamConfigComponent(
        technique,
        template,
        setTemplateParameters,
        setResourceParameters,
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
          {parameterConfigurationComponent ?? (
            <p>No available component for {template} template</p>
          )}
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
        <Typography>No templates available</Typography>
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
