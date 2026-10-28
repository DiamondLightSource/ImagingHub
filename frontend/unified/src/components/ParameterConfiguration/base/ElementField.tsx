import { useState, useEffect } from "react";

import { TextField } from "@mui/material";

import ElementSelect from "./../../../../../shared_components/ElementSelect";
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
  const [value, setValue] = useState({
    element: "",
    transition: "",
  });

  useEffect(() => {
    setParameters((prev) => ({
      ...prev,
      [parameterNames[0]]: value.element,
      [parameterNames[1]]: value.transition,
    }));
  }, [value]);

  return (
    <ElementSelect
      title={title}
      info={info}
      value={value}
      onChange={(value) => setValue(value)}
    />
  );
};

export default ElementField;
