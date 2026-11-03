import { useState } from "react";

import ElementSelect from "./../../../../../shared_components/ElementSelect";
import type { ElementPair } from "./../../../../../shared_components/types";
import type { TemplateComponentProps } from "./../../../types";

type ElementFieldProps = TemplateComponentProps & {
  title: string;
  info: string;
  parameterNames: string[];
};

const ElementField = ({
  setParameters,
  title,
  info,
  parameterNames,
}: ElementFieldProps) => {
  const [value, setValue] = useState<ElementPair>({
    element: "-",
    transition: "-",
  });

  const handleChange = (newValue: ElementPair) => {
    setValue(newValue);
    setParameters((prev) => ({
      ...prev,
      [parameterNames[0]]: newValue.element,
      [parameterNames[1]]: newValue.transition,
    }));
  };

  return (
    <ElementSelect
      title={title}
      info={info}
      value={value}
      onChange={handleChange}
    />
  );
};

export default ElementField;
