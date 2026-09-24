import { Alert, Button, Snackbar, Typography } from "@mui/material";
import { Beamline, Option, Technique } from "../../types";
import OptionSelect from "../OptionSelect";
import { CorSweepParameterConfiguration } from "./TomoParameterConfiguration";
import { PtyrexParameterConfiguration } from "./PtyrexParameterConfiguration";
import { ReactElement, useState } from "react";
import { LoaderProvider } from "../../../../tomography/src/contexts/LoaderContext";
import { SUBMIT_WORKFLOW_TEMPLATE } from "../../../../tomography/src/components/workflows/Submission";
import { useMutation } from "@apollo/client/react";
import { Visit, visitToText } from "@diamondlightsource/sci-react-ui";
import { InstrumentSession } from "../SessionSelector";

type ParameterConfigurationProps = {
  technique: Technique;
  template: string;
  setTemplate: (_: string) => void;
  availableTemplates: Option[];
  visit: Visit;
  beamline: Beamline;
  startTime: InstrumentSession["startTime"];
  scanIds: number[];
};

/**
 * Map from a `@Technique` and a template to the component for configuring the parameters of that
 * specific template
 * @type
 */
type TemplateComponentMapping = {
  [technique in Technique]: {
    [template: string]: ReactElement;
  };
};

const DLS_FILESYSTEM_BEAMLINE_RAW_DATA_DIR_MAPPINGS = {
  [Beamline.DIAD]: "nexus",
  [Beamline["I08-1"]]: "nexus",
  [Beamline.I12]: "rawdata",
  [Beamline["I13-1"]]: "raw",
  [Beamline["I13-2"]]: "raw",
  [Beamline.I14]: "scan",
};

const determineBeamlineRawDataFilepath = (
  beamline: Beamline,
  visitDirpath: string,
  scanId: number
): string => {
  const rawDataDirname =
    DLS_FILESYSTEM_BEAMLINE_RAW_DATA_DIR_MAPPINGS[
      beamline as keyof typeof DLS_FILESYSTEM_BEAMLINE_RAW_DATA_DIR_MAPPINGS
    ];
  return `${visitDirpath}${rawDataDirname}/${scanId}.nxs`;
};

const determineBeamlineVisitDirpath = (
  beamline: Beamline,
  year: string,
  visit: Visit
) => {
  return `/dls/${beamline}/data/${year}/${visitToText(visit)}/`;
};

export const ParameterConfiguration: React.FC<ParameterConfigurationProps> = ({
  technique,
  template,
  setTemplate,
  availableTemplates,
  visit,
  beamline,
  startTime,
  scanIds,
}: ParameterConfigurationProps) => {
  const [templateParameters, setTemplateParameters] = useState<object>({});
  const [resourceParameters] = useState({
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
      input: rawDataFilepath,
      ...templateParameters,
      ...resourceParameters,
    };
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
    [Technique.Ptycho]: {},
    [Technique.Ptyrex]: {
      "ptyrex-submission": (
        <PtyrexParameterConfiguration
          setParameters={setTemplateParameters}
          visitDirpath={visitDirpath}
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
    },
    [Technique.Xanes]: {},
    [Technique.Xrd]: {},
  };

  const PlaceholderComponent = (
    <p>No available component for {template} template</p>
  );

  return (
    <>
      <OptionSelect
        label="Template"
        value={template}
        options={availableTemplates}
        onChange={(e) => setTemplate(e.target.value)}
      />

      <Typography variant="h6">Options</Typography>

      {TEMPLATE_TO_COMPONENT_MAPPING[technique][template] ??
        PlaceholderComponent}

      <div>
        <Button variant="contained" color="primary" onClick={handleSubmitJob}>
          Submit job
        </Button>
      </div>
      <Snackbar
        open={notification !== undefined}
        autoHideDuration={6000}
        onClose={() => setNotification(undefined)}
        children={notification}
      />
    </>
  );
};
