import { useState } from "react";

import OptionSelect from "./../../../../../shared_components/OptionSelect";
import type { Option } from "./../../../../../shared_components/types";
import type { TemplateComponentProps } from "./../../../types";

type OptionSelectFieldProps = TemplateComponentProps & {
  label: string;
  parameterName: string;
  options: Option[];
};

const OptionSelectField = ({
  setParameters,
  label,
  parameterName,
  options,
}: OptionSelectFieldProps) => {
  const [value, setValue] = useState("");

  const handleChange = (newValue: ElementPair) => {
    setValue(newValue);
    setParameters((prev) => ({
      ...prev,
      [parameterName]: value,
    }));
  };

  return (
    <OptionSelect
      size="small"
      label={label}
      value={value}
      onChange={handleChange}
      options={options}
    />
  );
};

export default OptionSelectField;
