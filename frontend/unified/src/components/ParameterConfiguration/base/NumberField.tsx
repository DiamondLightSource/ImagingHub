import { useState } from "react";

import { TextField } from "@mui/material";

import type { TemplateComponentProps } from "./../../../types";

type NumberFieldProps = TemplateComponentProps & {
  label: string;
  parameterName: string;
};

const NumberField = ({
  setParameters,
  label,
  parameterName,
}: TemplateComponentProps) => {
  const [value, setValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setValue(v);
    setParameters((prev) => ({
      ...prev,
      [parameterName]: Number(v),
    }));
  };

  return (
    <TextField
      size="small"
      type="number"
      label={label}
      value={value}
      onChange={handleChange}
    />
  );
};

export default NumberField;
