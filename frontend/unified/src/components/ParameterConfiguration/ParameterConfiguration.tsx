import { Button, Typography } from "@mui/material";
import { Option, Technique } from "../../types";
import OptionSelect from "../OptionSelect";
import { CorSweepParameterConfiguration } from "./TomoParameterConfiguration";
import { ReactElement, useState } from "react";
import { LoaderProvider } from "../../../../tomography/src/contexts/LoaderContext";
import { SUBMIT_WORKFLOW_TEMPLATE } from "../../../../tomography/src/components/workflows/Submission";
import { useFragment, useMutation } from "@apollo/client/react";
import { Visit } from "@diamondlightsource/sci-react-ui";
import { gql, TypedDocumentNode } from "@apollo/client";
import { ParamConfigSessionStartTimeFragmentFragment } from "./__generated__/ParameterConfiguration.generated";
import { InstrumentSession } from "../../types";
import { apolloClientUlims } from "../../../../src/ApolloClient";

type ParameterConfigurationProps = {
  technique: Technique;
  template: string;
  setTemplate: (_: string) => void;
  availableTemplates: Option[];
  visit: Visit;
  session: InstrumentSession;
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

// TODO: The filename part of this should come from the scan selector component
const HARDCODED_INPUT_FILEPATH =
  "/dls/i12/data/2025/cm40628-3/rawdata/188700.nxs";

export const SESSION_START_TIME_FRAGMENT: TypedDocumentNode<ParamConfigSessionStartTimeFragmentFragment> = gql`
  fragment ParamConfigSessionStartTimeFragment on InstrumentSession {
    __typename
    startTime
  }
`;

export const ParameterConfiguration: React.FC<ParameterConfigurationProps> = ({
  technique,
  template,
  setTemplate,
  availableTemplates,
  visit,
  session,
}: ParameterConfigurationProps) => {
  const [templateParameters, setTemplateParameters] = useState<object>({});
  const [resourceParameters] = useState({
    nprocs: 1,
    memory: "20Gi",
  });

  console.log("session passed to ParameterConfiguration is: ", session);

  const calculatedCacheId = apolloClientUlims.cache.identify({
    __typename: session.__typename,
    proposal: session.proposal,
    instrumentSessionNumber: session.instrumentSessionNumber,
  });
  console.log("calculateCacheId is: ", calculatedCacheId);

  const [mutation] = useMutation(SUBMIT_WORKFLOW_TEMPLATE);
  const { complete, dataState, data } =
    useFragment<ParamConfigSessionStartTimeFragmentFragment>({
      fragment: SESSION_START_TIME_FRAGMENT,
      from: {
        // Pass typename and object containing key fields, and apollo (I imagine) would construct
        // the ref string from these
        // __typename: session.__typename,
        // id: idObject,

        // Or pass just the ID string manually constructed
        __ref: calculatedCacheId,
      },
    });

  const manuallyReadFragmentData = apolloClientUlims.cache.readFragment({
    id: calculatedCacheId,
    fragment: SESSION_START_TIME_FRAGMENT,
  });

  console.log("manuallyReadFragmentData is: ", manuallyReadFragmentData);

  console.log("dataState is: ", dataState);
  console.log("data is: ", data);
  if (data === undefined) {
    return <p>Session start time is undefined...</p>;
  }

  if (!complete) {
    return <p>Session start time fetching is incomplete...</p>;
  }

  console.log("data is: ", data);

  const handleSubmitJob = () => {
    // TODO: Validate parameters against JSON schema attached to the workflow template before
    // sending the mutation
    console.log("Submit job");
    const parameters = {
      input: HARDCODED_INPUT_FILEPATH,
      ...templateParameters,
      ...resourceParameters,
    };
    mutation({
      variables: {
        name: template,
        parameters,
        visit: visit,
      },
    });
  };

  const TEMPLATE_TO_COMPONENT_MAPPING: TemplateComponentMapping = {
    [Technique.Dpc]: {},
    [Technique.Nbed]: {},
    [Technique.Ptycho]: {},
    [Technique.Tomo]: {
      "httomo-cor-sweep": (
        <LoaderProvider>
          <CorSweepParameterConfiguration
            setParameters={setTemplateParameters}
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
    </>
  );
};
