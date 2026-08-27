import { Option } from "../../types";
import OptionSelect from "../OptionSelect";

type ParameterConfigurationProps = {
  template: string;
  setTemplate: (_: string) => void;
  availableTemplates: Option[];
};

export const ParameterConfiguration: React.FC<ParameterConfigurationProps> = ({
  template,
  setTemplate,
  availableTemplates,
}: ParameterConfigurationProps) => {
  return (
    <>
      <OptionSelect
        label="Template"
        value={template}
        options={availableTemplates}
        onChange={(e) => setTemplate(e.target.value)}
      />
    </>
  );
};
