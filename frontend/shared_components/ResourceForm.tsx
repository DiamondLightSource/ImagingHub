import React, { FC, ChangeEvent, useState } from "react";
import {
  Button,
  MenuItem,
  IconButton,
  InputLabel,
  Grid,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

type FormRes = { cpus: string; gpus: string; nprocs: string; memory: string };

const initialData: FormRes = {
  cpus: "1",
  gpus: "0",
  nprocs: "8",
  memory: "16Gi",
};

export const ResourceForm: FC = () => {
  const [res, setRes] = useState<FormRes>(initialData);

  return (
    <Grid container justifyContent="start" spacing={1}>
      <Grid size={8}>
        <Stack direction="column" spacing={2}>
          <InputLabel size="small" id="workflow-select-label">
            Resources
          </InputLabel>
          <TextField
            name="cpus"
            label="cpus"
            variant="outlined"
            size="small"
            placeholder="8"
            type="text"
            value={res.cpus}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value;
              setRes((prev) => ({ ...prev, cpus: value }));
            }}
          />
          <TextField
            name="gpus"
            label="gpus"
            variant="outlined"
            size="small"
            placeholder="1"
            type="text"
            value={res.gpus}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value;
              setRes((prev) => ({ ...prev, gpus: value }));
            }}
          />
          <TextField
            name="nprocs"
            label="number of processes"
            variant="outlined"
            size="small"
            placeholder="8"
            type="text"
            value={res.nprocs}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value;
              setRes((prev) => ({ ...prev, nprocs: value }));
            }}
          />
          <TextField
            name="memory"
            label="memory"
            variant="outlined"
            size="small"
            placeholder="16Gi"
            type="text"
            value={res.memory}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value;
              setRes((prev) => ({ ...prev, memory: value }));
            }}
          />
        </Stack>
      </Grid>
    </Grid>
  );
};

export default ResourceForm;
