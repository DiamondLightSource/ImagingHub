import { useState, useEffect } from "react";

import { TextField } from "@mui/material";
import { InputAdornment } from "@mui/material";

import type { TemplateComponentProps } from "../../types";

type VisitDirFieldProps = TemplateComponentProps & {
  label: string;
  parameterName: string;
};

const VisitDirField = ({
  setParameters,
  visitDirpath,
  label,
  parameterName,
}: VisitDirFieldProps) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    setParameters({
      [parameterName]: visitDirpath + value,
    });
  }, [value, visitDirpath, parameterName, setParameters]);

  return (
    <TextField
      size="small"
      label={label}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start" sx={{ mr: 0 }}>
              {visitDirpath}
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

export default VisitDirField;
