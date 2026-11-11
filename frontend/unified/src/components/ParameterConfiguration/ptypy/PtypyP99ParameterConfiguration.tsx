import { Card, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { TemplateComponentProps } from "../../../types";

const PtypyP99ParameterConfiguration = ({
  setParameters,
}: TemplateComponentProps) => {
  const [inPath, setInPath] = useState<string>(
    "processing/writenData/reconstruction_test_data"
  );
  const [outPath, setOutPath] = useState<string>("processing/workflows/ptypy");

  useEffect(() => {
    setParameters({
      inpath: inPath,
      outpath: outPath,
    });
  }, [setParameters, inPath, outPath]);

  return (
    <Card
      variant="outlined"
      sx={{
        mb: 2,
        p: 2,
        border: "1px solid #89987880",
        borderRadius: "4px",
      }}
    >
      <Stack direction="column" spacing={2}>
        <TextField
          label="Path to raw data folder"
          value={inPath}
          onChange={(e) => setInPath(e.target.value)}
          size="small"
        />
        <TextField
          label="Path to output folder"
          value={outPath}
          onChange={(e) => setOutPath(e.target.value)}
          size="small"
        />
      </Stack>
    </Card>
  );
};

export default PtypyP99ParameterConfiguration;
