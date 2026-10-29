import { FC, useState, useEffect } from "react";
import {
  Stack,
  TextField,
  FormControlLabel,
  Checkbox,
  Card,
} from "@mui/material";

export type ResourceFormProps = {
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

  const [memory, setMemory] = useState<string>(resourceDisplayList.memory?.default)
  const [nprocs, setNprocs] = useState<string>(resourceDisplayList.nprocs?.default)
  const [useGpu, setUseGpu] = useState<boolean>(resourceDisplayList.usegpu?.default)

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
      {resourceDisplayList.memory?.default || 
      resourceDisplayList.nprocs?.default || 
      resourceDisplayList.usegpu?.default ? (
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
            {resourceDisplayList.memory?.default && (
              <TextField
                label="Requested CPU memory"
                value={memory}
                onChange={(e) => setMemory(e.target.value)}
                size="small"
              />
            )}
            {resourceDisplayList.nprocs?.default && (
              <TextField
                label="Nr. of processes"
                value={nprocs}
                onChange={(e) => setNprocs(e.target.value)}
                size="small"
                type="number"
              />
            )}
          </Stack>
          {resourceDisplayList.usegpu?.default && (
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
