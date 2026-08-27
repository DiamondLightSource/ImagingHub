import { Button, Typography } from "@mui/material";
import { Option, Technique } from "../../types";
import OptionSelect from "../OptionSelect";
import { CorSweepParameterConfiguration } from "./TomoParameterConfiguration";
import { ReactElement } from "react";

type ParameterConfigurationProps = {
  technique: Technique;
  template: string;
  setTemplate: (_: string) => void;
  availableTemplates: Option[];
};

type TemplateComponentMapping = {
  [key: string]: ReactElement;
};

export const ParameterConfiguration: React.FC<ParameterConfigurationProps> = ({
  technique,
  template,
  setTemplate,
  availableTemplates,
}: ParameterConfigurationProps) => {
  const TOMO_TEMPLATE_COMPONENT_MAPPING: TemplateComponentMapping = {
    "httomo-cor-sweep": <CorSweepParameterConfiguration />,
  };

  const TECHNIQUE_TO_COMPONENT_MAPPING = {
    [Technique.Tomo]: TOMO_TEMPLATE_COMPONENT_MAPPING,
  };

  const PlaceholderComponent = (
    <p>No available component for {technique} technique</p>
  );

  const displayTemplateComponent = () => {
    if (
      TECHNIQUE_TO_COMPONENT_MAPPING[
        technique as keyof typeof TECHNIQUE_TO_COMPONENT_MAPPING
      ] === undefined
    ) {
      return PlaceholderComponent;
    }

    return (
      TECHNIQUE_TO_COMPONENT_MAPPING[
        technique as keyof typeof TECHNIQUE_TO_COMPONENT_MAPPING
      ][template] ?? PlaceholderComponent
    );
  };

  return (
    <>
      <OptionSelect
        label="Template"
        value={template}
        options={availableTemplates}
        onChange={(e) => setTemplate(e.target.value)}
      />

      <Typography variant="h6">Options</Typography>

      {displayTemplateComponent()}

      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={() => console.log("Submit job")}
        >
          Submit job
        </Button>
      </div>
    </>
  );
};
