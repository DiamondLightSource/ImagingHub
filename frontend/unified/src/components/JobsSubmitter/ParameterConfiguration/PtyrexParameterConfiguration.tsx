import { Card, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { TemplateComponentProps } from "../../types";

export const PtyrexParameterConfiguration = ({
  setParameters,
}: TemplateComponentProps) => {
  const [configPath, setConfigPath] = useState<string>("");
  const [projectionNumber, setProjectionNumber] = useState<string>("");

  useEffect(() => {
    setParameters({
      config_json: configPath,
      scan_number: 398894,
      projection_number: projectionNumber,
      nprocs: 4,
      memory: "32Gi",
    });
  }, [configPath, projectionNumber]);

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
            label={"Ptyrex config file path"}
            value={configPath}
            onChange={(e) => setConfigPath(e.target.value)}
          />
          <TextField
            label={"Projection Number"}
            value={projectionNumber}
            onChange={(e) => setProjectionNumber(e.target.value)}
          />
        </Stack>
      </Card>
    </>
  );
};
