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
  setResourceParameters,
}: {
  setParameters: (_: object) => void;
  setResourceParameters: (_: object) => void;
}) => {
  const [id, setId] = useState<number>(1);
  const [binning, setBinning] = useState<number>(2);
  const [defocus, setDefocus] = useState<number>(50);
  const [memory, setMemory] = useState<string>("100Gi");
  const [nprocs, setNprocs] = useState<number>(1);
  const [numIter, setNumIter] = useState<number>(100);
  const [probeModes, setProbeModes] = useState<number>(1);
  const [outPath, setOutPath] = useState<string>("processing/workflows/ptypy");
  const [useGpu, setUseGpu] = useState<boolean>(true);

  useEffect(() => {
    setParameters({
      id: id,
      outpath: outPath,
      defocus: defocus,
      binning: binning,
      numiter: numIter,
      probeModes: probeModes,
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
          error={!id}
          label="Scan Number"
          value={id}
          onChange={(e) => setId(Number(e.target.value))}
          size="small"
          type="number"
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
          onChange={(e) => setBinning(Number(e.target.value))}
          size="small"
          type="number"
        />
        <TextField
          label="Expected defocus in microns"
          value={defocus}
          onChange={(e) => setDefocus(Number(e.target.value))}
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
          onChange={(e) => setNprocs(Number(e.target.value))}
          size="small"
        />
        <TextField
          label="Nr. of iterations"
          value={binning}
          onChange={(e) => setNumIter(Number(e.target.value))}
          size="small"
        />
        <TextField
          label="Nr. of probe modes"
          value={probeModes}
          onChange={(e) => setProbeModes(Number(e.target.value))}
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
