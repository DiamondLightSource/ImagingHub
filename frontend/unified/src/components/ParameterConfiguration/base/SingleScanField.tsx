import { useState, useEffect } from "react";

import { TextField } from "@mui/material";

import type { TemplateComponentProps } from "./../../../types";

const SingleScanField = ({ setParameters }: TemplateComponentProps) => {
  const [singleScan, setSingleScan] = useState("");

  useEffect(() => {
    setParameters((prev) => ({
      ...prev,
      scanNumber: singleScan,
    }));
  }, [singleScan]);

  return (
    <TextField
      size="small"
      type="number"
      label={"Scan Number"}
      value={singleScan}
      onChange={(e) => setSingleScan(Number(e.target.value))}
    />
  );
};

export default SingleScanField;
