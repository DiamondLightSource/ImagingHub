import { Button, Typography } from "@mui/material";
import { Option, Technique } from "../../types";
import OptionSelect from "../OptionSelect";
import { TomoParameterConfiguration } from "./TomoParameterConfiguration";

type ParameterConfigurationProps = {
  technique: Technique;
  template: string;
  setTemplate: (_: string) => void;
  availableTemplates: Option[];
};

export const ParameterConfiguration: React.FC<ParameterConfigurationProps> = ({
  technique,
  template,
  setTemplate,
  availableTemplates,
}: ParameterConfigurationProps) => {
  const TECHNIQUE_TO_COMPONENT_MAPPING = {
    [Technique.Tomo]: <TomoParameterConfiguration template={template} />,
  };

  const PlaceholderComponent = (
    <p>No available component for {technique} technique</p>
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

      {TECHNIQUE_TO_COMPONENT_MAPPING[
        technique as keyof typeof TECHNIQUE_TO_COMPONENT_MAPPING
      ] ?? PlaceholderComponent}

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
