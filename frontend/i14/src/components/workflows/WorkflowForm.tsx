import React, { FC, ChangeEvent, useState } from "react";
import {
  Button,
  MenuItem,
  InputLabel,
  Grid,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import { visitRegex } from "@diamondlightsource/sci-react-ui";

type FormData = { visit: string; workflow: string };

const initialData: FormData = {
  visit: "cm23467-2",
  workflow: "dpc-batch",
};

export const WorkflowForm: FC = () => {
  const [data, setData] = useState<FormData>(initialData);
  const visitMatch = visitRegex.exec(data.visit);

  const openInNewTab = (url: string) => {
    const w = window.open(url, "_blank");
    if (w) w.focus();
  };

  const openLink = () => {
    if (!visitMatch) return;
    const linkString = `https://workflows.diamond.ac.uk/templates/${data.workflow}/${data.visit}`;
    openInNewTab(linkString);
  };

  const workflowOptions = [
    { label: "DPC", value: "dpc-batch" },
    { label: "XANES Auto-processing", value: "xanes" },
    { label: "XANES Point", value: "xanes-point" },
    { label: "XANES Sparse", value: "xanes-sparse" },
    { label: "XRD 1D", value: "xrd1d-batch" },
    { label: "XRD 2D", value: "xrd2d-batch" },
  ];

  return (
    <Grid container justifyContent="center" spacing={1}>
      <Grid size={6}>
        <Typography variant="h4">I14 Workflows</Typography>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            openLink();
          }}
        >
          <Stack direction="column" spacing={2}>
            <InputLabel size="small" id="workflow-select-label">
              Workflow
            </InputLabel>
            <Select
              labelId="workflow-select-label"
              label="Workflow"
              variant="outlined"
              size="small"
              name="workflow"
              value={data.workflow}
              onChange={(e: SelectChangeEvent<string>) =>
                setData((prev) => ({ ...prev, workflow: e.target.value }))
              }
            >
              {workflowOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>

            <TextField
              name="visit"
              label="Visit"
              variant="outlined"
              size="small"
              placeholder="Visit"
              type="text"
              value={data.visit}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value;
                setData((prev) => ({ ...prev, visit: value }));
              }}
              helperText={
                visitMatch ? "" : "Expected format: xx12345-1"
              }
              error={!visitMatch}
            />

            <Button variant="contained" type="submit" disabled={!visitMatch}>
              Submit
            </Button>
          </Stack>
        </form>
      </Grid>
    </Grid>
  );
};

export default WorkflowForm;
