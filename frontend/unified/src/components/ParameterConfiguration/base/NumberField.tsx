import { useState } from "react";

import IconButton from "@mui/material/IconButton";
import FormLabel from "@mui/material/FormLabel";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";

import { Info } from "lucide-react";

import type { TemplateComponentProps } from "./../../../types";

type NumberFieldProps = TemplateComponentProps & {
  label: string;
  info?: string;
  parameterName: string;
  inProps?: dict;
};

const NumberField = ({
  setParameters,
  label,
  info,
  parameterName,
  inProps,
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
    <Stack direction="row" alignItems="center">
      <TextField
        size="small"
        type="number"
        label={label}
        inputProps={inProps}
        value={value}
        sx={{ minWidth: "160px" }}
        onChange={handleChange}
      />
      {info && (
        <Tooltip title={info}>
          <IconButton>
            <Info />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  );
};

export default NumberField;
