import React, { FC } from "react";
import {
  Card,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { TemplateComponentProps } from "../../../types";

export const VirtualImageConfiguration = ({
  setParameters,
}: TemplateComponentProps) => {
  const [sample, setSample] = useState<string>("");

  const [mibIndex, setmibIndex] = useState(0);
  const mibMethods = ["Auto", "None", "Fly-back", "By known shape"];
  const mibPyMethods = [
    "--auto-reshape",
    "--no-reshaping",
    "--use-fly-back",
    "--known-shape",
  ];

  useEffect(() => {
    setParameters({
      sample_name: sample,
    });
  }, [sample]);

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          mb: 2,
          p: 2,
          border: "1px solid #89987880",
          borderRadius: "4px",
        }}
      >
        <Stack direction="column" spacing={1}>
          <TextField
            label={"Name of the sample"}
            value={sample}
            onChange={(e) => setSample(e.target.value)}
          />
        </Stack>
      </Card>
    </>
  );
};
