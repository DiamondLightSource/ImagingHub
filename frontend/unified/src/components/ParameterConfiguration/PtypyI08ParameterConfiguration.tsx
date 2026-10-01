import {
  Card,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

const PtypyI08ParameterConfiguration = ({
  setParameters,
}: {
  setParameters: (_: object) => void;
}) => {
  const [id, setId] = useState<string>("");
  const [binning, setBinning] = useState<string>("2");
  const [defocus, setDefocus] = useState<string>("50");
  const [memory, setMemory] = useState<string>("100Gi");
  const [nprocs, setNprocs] = useState<string>("1");
  const [numIter, setNumIter] = useState<string>("100");
  const [probeModes, setProbeModes] = useState<string>("1");
  const [outPath, setOutPath] = useState<string>("processing/workflows/ptypy");
  const [useGpu, setUseGpu] = useState<boolean>(true);

  useEffect(() => {
    setParameters({
      id: id,
      outpath: outPath,
      defocus: defocus,
      binning: binning,
      memory: memory,
      nprocs: nprocs,
      numiter: numIter,
      probeModes: probeModes,
      usegpu: useGpu,
    });
  }, [
    setParameters,
    id,
    binning,
    defocus,
    memory,
    nprocs,
    numIter,
    probeModes,
    outPath,
    useGpu,
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
          label="Path to output folder"
          value={outPath}
          onChange={(e) => setOutPath(e.target.value)}
          size="small"
        />
        <TextField
          label="Detector bin factor"
          value={binning}
          onChange={(e) => setBinning(e.target.value)}
          size="small"
        />
        <TextField
          label="Expected defocus in microns"
          value={defocus}
          onChange={(e) => setDefocus(e.target.value)}
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
        <TextField
          label="Nr. of iterations"
          value={binning}
          onChange={(e) => setNumIter(e.target.value)}
          size="small"
        />
        <TextField
          label="Nr. of probe modes"
          value={probeModes}
          onChange={(e) => setProbeModes(e.target.value)}
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

export default PtypyI08ParameterConfiguration;
