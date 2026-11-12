import { useState } from "react";

import Checkbox from "@mui/material/Checkbox";
import Stack from "@mui/material/Stack";

import FieldLabel from "./../../../../../shared_components/FieldLabel";
import type { TemplateComponentProps } from "./../../../types";

type CheckboxFieldProps = TemplateComponentProps & {
  label: string;
  desc?: string;
  parameterName: string;
};

const CheckboxField = ({
  setParameters,
  label,
  desc,
  parameterName,
}: CheckboxFieldProps) => {
  const [value, setValue] = useState<boolean>(false);

  const handleChange = (e) => {
    setValue(e.target.checked);
    setParameters((prev) => ({
      ...prev,
      [parameterName]: e.target.checked,
    }));
  };

  return (
    <Stack direction="row" alignItems="center">
      <Checkbox checked={value} onChange={handleChange} sx={{ p: 0.5 }} />
      <FieldLabel label={label} desc={desc} />
    </Stack>
  );
};

export default CheckboxField;
