import { useState } from "react";

import { TextField } from "@mui/material";

import type { TemplateComponentProps } from "./../../../types";

const SingleScanField = ({ setParameters }: TemplateComponentProps) => {
  const [singleScan, setSingleScan] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const single = e.target.value;
    setSingleScan(single);
    setParameters((prev) => ({
      ...prev,
      scanNumber: Number(single),
    }));
  };

  return (
    <TextField
      size="small"
      type="number"
      label={"Scan Number"}
      value={singleScan}
      onChange={handleChange}
    />
  );
};

export default SingleScanField;
