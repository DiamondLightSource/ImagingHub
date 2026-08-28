import { Button, Typography } from "@mui/material";
import { Option, Technique } from "../../types";
import OptionSelect from "../OptionSelect";
import { CorSweepParameterConfiguration } from "./TomoParameterConfiguration";
import { ReactElement, useState } from "react";
import { LoaderProvider } from "../../../../tomography/src/contexts/LoaderContext";

type ParameterConfigurationProps = {
  technique: Technique;
  template: string;
  setTemplate: (_: string) => void;
  availableTemplates: Option[];
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

export const ParameterConfiguration: React.FC<ParameterConfigurationProps> = ({
  technique,
  template,
  setTemplate,
  availableTemplates,
}: ParameterConfigurationProps) => {
  const [templateParameters, setTemplateParameters] = useState<object>({});
  const [resourceParameters] = useState({
    nprocs: 1,
    memory: "20Gi",
  });

  const handleSubmitJob = () => {
    console.log("Submit job");
    const parameters = { ...templateParameters, ...resourceParameters };
    // TODO: Send mutation
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
