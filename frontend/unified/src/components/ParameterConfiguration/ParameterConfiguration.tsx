import { Alert, Button, Snackbar, Typography } from "@mui/material";
import { Beamline, Technique } from "../../types";
import { CorSweepParameterConfiguration } from "./TomoParameterConfiguration";
import { PtyrexParameterConfiguration } from "./PtyrexParameterConfiguration";
import { MibParameterConfiguration } from "./MibParameterConfiguration";
import { ReactElement, Suspense, useState } from "react";
import { LoaderProvider } from "../../../../tomography/src/contexts/LoaderContext";
import { SUBMIT_WORKFLOW_TEMPLATE } from "../../../../tomography/src/components/workflows/Submission";
import { useMutation } from "@apollo/client/react";
import { Visit, visitToText } from "@diamondlightsource/sci-react-ui";
import { InstrumentSession } from "../SessionSelector";
import { Fbp180ParameterConfiguration } from "./Fbp180ParameterConfiguration";
import PtypyI08ParameterConfiguration from "./PtypyI08ParameterConfiguration";
import PtypyP99ParameterConfiguration from "./PtypyP99ParameterConfiguration";
import { XanesAutoprocessingParameterConfiguration } from "./XanesAutoprocessingParameterConfiguration";
import TemplateSelector from "../ProcessingView/TemplateSelector";
import { templateOptions } from "../../data/templates";
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

  const TEMPLATE_TO_COMPONENT_MAPPING: TemplateComponentMapping = {
    [Technique.Dpc]: {},
    [Technique.Nbed]: {},
    [Technique.Mib]: {
      "e02mib2x-auto": (
        <MibParameterConfiguration setParameters={setTemplateParameters} />
      ),
    },
    [Technique.Ptycho]: {},
    [Technique.Ptypy]: {
      "ptypy-i08-1-from-config": (
        <PtypyI08ParameterConfiguration
          setParameters={setTemplateParameters}
          setResourceParameters={setResourceParameters}
        />
      ),
      "ptypy-p99-from-config": (
        <PtypyP99ParameterConfiguration
          setParameters={setTemplateParameters}
          setResourceParameters={setResourceParameters}
        />
      ),
    },
    [Technique.Ptyrex]: {
      "ptyrex-submission": (
        <PtyrexParameterConfiguration
          setParameters={setTemplateParameters}
          visitDirpath={visitDirpath}
          scanIds={scanIds}
        />
      ),
    },
    [Technique.Tomo]: {
      "httomo-cor-sweep": (
        <LoaderProvider>
          <CorSweepParameterConfiguration
            setParameters={setTemplateParameters}
            visitDirpath={visitDirpath}
          />
        </LoaderProvider>
      ),
      "httomo-fbp-180": (
        <LoaderProvider>
          <Fbp180ParameterConfiguration
            setParameters={setTemplateParameters}
            setResourceParameters={setResourceParameters}
            visitDirpath={visitDirpath}
          />
        </LoaderProvider>
      ),
    },
    [Technique.Xanes]: {
      xanes: (
        <Suspense fallback={<p>Fetching workflow template...</p>}>
          <XanesAutoprocessingParameterConfiguration
            setParameters={setTemplateParameters}
          />
        </Suspense>
      ),
    },
    [Technique.Xrd]: {},
  };

  const PlaceholderComponent = (
    <p>No available component for {template} template</p>
  );

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
          {TEMPLATE_TO_COMPONENT_MAPPING[technique][template] ??
            PlaceholderComponent}
          <Button
            disabled={!TEMPLATE_TO_COMPONENT_MAPPING[technique][template]}
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
