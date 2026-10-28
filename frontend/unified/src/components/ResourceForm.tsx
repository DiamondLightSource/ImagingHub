import { FC, ChangeEvent, useState, useEffect } from "react";
import {
  InputLabel,
  Grid,
  Stack,
  TextField,
  FormControlLabel,
  Checkbox,
  Card,
  Typography,
} from "@mui/material";

export type ResourceFormProps = {
  //params: ResourceParameters;
  setParams: (_: ResourceParameters) => void;
  showGpu?: boolean;
  setUseGpu: (_: boolean | null) => void;
  setMemory: (_: string | null) => void;
  setNprocs: (_: string | null) => void;
  showGpuChoice: boolean;
  showMemChoice: boolean;
  showProcChoice: boolean;
};

export type ResourceParameters = {
  useGpu: boolean;
  nprocs: string;
  memory: string;
};

export const ResourceForm: FC = ({
  resourceDisplayList,
  setResourceParameters,
}: any) => {
  var defaultMem: string = "20Gi";
  var defaultNprocs: string = "1";
  var defaultGpu: boolean = true;
  if (Object.hasOwn(resourceDisplayList, "memory")) {
    defaultMem = resourceDisplayList.memory.default;
  }
  if (Object.hasOwn(resourceDisplayList, "nprocs")) {
    defaultNprocs = resourceDisplayList.nprocs.default;
  }
  if (Object.hasOwn(resourceDisplayList, "usegpu")) {
    defaultGpu = resourceDisplayList.usegpu.default;
  }

  const [memory, setMemory] = useState<string>(defaultMem);
  const [nprocs, setNprocs] = useState<string>(defaultNprocs);
  const [useGpu, setUseGpu] = useState<boolean>(defaultGpu);

  useEffect(() => {
    (setResourceParameters({
      memory: memory,
      nprocs: nprocs,
      useGpu: useGpu,
    }),
      [setResourceParameters, memory, nprocs, useGpu]);
  }, []);

  return (
    <>
      {Object.hasOwn(resourceDisplayList, "memory") ||
      Object.hasOwn(resourceDisplayList, "nprocs") ||
      Object.hasOwn(resourceDisplayList, "usegpu") ? (
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
            {Object.hasOwn(resourceDisplayList, "memory") && (
              <TextField
                label="Requested CPU memory"
                value={memory}
                onChange={(e) => setMemory(e.target.value)}
                size="small"
              />
            )}
            {Object.hasOwn(resourceDisplayList, "nprocs") && (
              <TextField
                label="Nr. of processes"
                value={nprocs}
                onChange={(e) => setNprocs(e.target.value)}
                size="small"
              />
            )}
          </Stack>
          {Object.hasOwn(resourceDisplayList, "usegpu") && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={useGpu}
                  onChange={(e) => setUseGpu(e.target.checked)}
                />
              }
              label="Use GPU"
            />
          )}
        </Card>
      ) : (
        <></>
      )}
    </>
  );
};

export default ResourceForm;
