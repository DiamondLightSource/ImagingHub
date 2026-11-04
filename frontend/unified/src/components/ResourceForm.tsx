import { useState, useEffect } from "react";
import {
  Stack,
  TextField,
  FormControlLabel,
  Checkbox,
  Card,
} from "@mui/material";
import { ResourceParameters } from "../types";

type ResourceFormProps = {
  resourceDisplayList: ResourceParameters;
  setResourceParameters: (_: ResourceParameters) => void;
};

export const ResourceForm = ({
  resourceDisplayList,
  setResourceParameters,
}: ResourceFormProps) => {
  const [memory, setMemory] = useState<string | undefined>(
    resourceDisplayList.memory
  );
  const [nprocs, setNprocs] = useState<string | undefined>(
    resourceDisplayList.nprocs
  );
  const [useGpu, setUseGpu] = useState<boolean | undefined>(
    resourceDisplayList.usegpu
  );

  useEffect(() => {
    setResourceParameters({
      memory: memory,
      nprocs: nprocs,
      usegpu: useGpu,
    });
  }, [setResourceParameters, memory, nprocs, useGpu]);

  return (
    <>
      {(resourceDisplayList.memory ||
        resourceDisplayList.nprocs ||
        resourceDisplayList.usegpu) && (
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
            {resourceDisplayList.memory && (
              <TextField
                label="Requested CPU memory"
                value={memory}
                onChange={(e) => setMemory(e.target.value)}
                size="small"
              />
            )}
            {resourceDisplayList.nprocs && (
              <TextField
                label="Nr. of processes"
                value={nprocs}
                onChange={(e) => setNprocs(e.target.value)}
                size="small"
                type="number"
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
      )}
    </>
  );
};

export default ResourceForm;
