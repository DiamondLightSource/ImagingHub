import { useState } from "react";
import { Technique } from "../../../types";
import { Visit } from "@diamondlightsource/sci-react-ui";
import TemplateSelector from "./TemplateSelector";
import { Button, Typography } from "@mui/material";
import { useMutation } from "@apollo/client/react";
import { SUBMIT_WORKFLOW_TEMPLATE } from "../../../../../tomography/src/components/workflows/Submission";
import { getTemplateComponent } from "./getTemplateComponent";
import { filterTemplates } from "./utils";

// TODO: The filename part of this should come from the scan selector component
const HARDCODED_INPUT_FILEPATH =
  "/dls/i12/data/2025/cm40628-3/rawdata/188700.nxs";

const ParameterConfiguration = ({
  technique,
  visit,
}: {
  technique: Technique;
  visit: Visit;
}) => {
  const templateList = filterTemplates(technique);
  const [template, setTemplate] = useState<string>(templateList[0].value);
  const [templateParameters, setTemplateParameters] = useState<object>({});
  const [resourceParameters] = useState({
    nprocs: 1,
    memory: "20Gi",
  });

  const [mutation] = useMutation(SUBMIT_WORKFLOW_TEMPLATE);

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

  if (!technique) {
    return <p>No Technique Selected</p>;
  }

  const PlaceholderComponent = (
    <p>No available component for {template} template</p>
  );

  return (
    <>
      <TemplateSelector
        templateList={templateList}
        template={template}
        setTemplate={setTemplate}
      />
      <Typography variant="h6">Options</Typography>

      {getTemplateComponent(technique, template, setTemplateParameters) ??
        PlaceholderComponent}

      <Button variant="contained" color="primary" onClick={handleSubmitJob}>
        Submit Job
      </Button>
    </>
  );
};

export default ParameterConfiguration;
