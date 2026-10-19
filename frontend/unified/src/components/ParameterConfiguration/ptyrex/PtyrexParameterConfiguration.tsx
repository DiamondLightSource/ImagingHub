import { Card, InputAdornment, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { TemplateComponentProps } from "../../types";

export const PtyrexParameterConfiguration = ({
  setParameters,
  visitDirpath,
}: TemplateComponentProps) => {
  const [configPath, setConfigPath] = useState<string>("");
  const [projectionNumber, setProjectionNumber] = useState<string>("");

  useEffect(() => {
    setParameters({
      config_json: visitDirpath + configPath,
      proj_number: projectionNumber,
      nprocs: 4,
      memory: "32Gi",
    });
  }, [setParameters, visitDirpath, configPath, projectionNumber]);

  const displayVisitDir = {
    input: {
      startAdornment: (
        <InputAdornment position="start" sx={{ mr: 0 }}>
          {visitDirpath}
        </InputAdornment>
      ),
    },
  };

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
            size="small"
            label="Ptyrex config file path"
            value={configPath}
            onChange={(e) => setConfigPath(e.target.value)}
            slotProps={displayVisitDir}
          />
          <TextField
            size="small"
            label="Projection Number"
            value={projectionNumber}
            onChange={(e) => setProjectionNumber(e.target.value)}
          />
        </Stack>
      </Card>
    </>
  );
};
