import {
  Card,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

const PtypyP99ParameterConfiguration = ({
  setParameters,
  setResourceParameters,
}: {
  setParameters: (_: object) => void;
  setResourceParameters: (_: object) => void;
}) => {
  const [id, setId] = useState<string>("");
  const [inPath, setInPath] = useState<string>(
    "processing/writenData/reconstruction_test_data"
  );
  const [outPath, setOutPath] = useState<string>("processing/workflows/ptypy");
  const [nprocs, setNprocs] = useState<string>("1");
  const [memory, setMemory] = useState<string>("20Gi");
  const [useGpu, setUseGpu] = useState<boolean>(false);

  useEffect(() => {
    setParameters({
      id: id,
      inpath: inPath,
      outpath: outPath,
      usegpu: useGpu,
    });
    setResourceParameters({
      memory: memory,
      nprocs: nprocs,
    });
  }, [
    setParameters,
    setResourceParameters,
    id,
    inPath,
    outPath,
    useGpu,
    memory,
    nprocs,
  ]);

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
          error={id.length === 0}
          label="Scan Number"
          value={id}
          onChange={(e) => setId(e.target.value)}
          size="small"
        />
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
        <TextField
          label="Requested CPU memory"
          value={memory}
          onChange={(e) => setMemory(e.target.value)}
          size="small"
        />
        <TextField
          label="Nr. of processes"
          value={nprocs}
          onChange={(e) => setNprocs(e.target.value)}
          size="small"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={useGpu}
              onChange={(e) => setUseGpu(e.target.checked)}
            />
          }
          label="Use GPU"
        />
      </Stack>
    </Card>
  );
};

export default PtypyP99ParameterConfiguration;
