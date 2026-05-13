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
import InfoIcon from "@mui/icons-material/Info";
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
    {
      label: "DPC",
      value: "dpc-batch",
      desc: "DPC imaging produces an image of the phase shifts to the X-ray beam as a result of interaction with the sample by measuring the gradient of the phase and retrieving the phase shifts by a straightforward integration step.",
    },
    {
      label: "XANES Auto-processing",
      value: "xanes",
      desc: "XANES is a utility which attempts to stack a sequence of datasets acquired at different energy for a particular line group and perform alignment based on a line group.",
    },
    {
      label: "XANES Point",
      value: "xanes-point",
      desc: "XANES-point is a utility which takes in a scan file (inpath) and a line group (edge_element), performs windowing of this line group, and saves a two-column text file (outpath): the first column is the energy in keV, and the second column is the summed windowed MCA intensity across the 4 channels.",
    },
    {
      label: "XANES Sparse",
      value: "xanes-sparse",
      desc: "XANES-sparse is a utility which takes the last scan file of a sparse XANES scan (inpath), defines the 2D full grid, inserts the data in the correct rows, stack the images, and completes the missing data by using looped alternating steepest descent (ASD).",
    },
    {
      label: "XRD 1D",
      value: "xrd1d-batch",
      desc: "XRD can be used to spatially map changes in crystallographic direction, d-spacing or strain across a sample.",
    },
    {
      label: "XRD 2D",
      value: "xrd2d-batch",
      desc: "XRD 2D is a utility which performs Azimuthal integration (ExcaliburXRDIntegration) and saves result to a nxs file",
    },
  ];

  const option = workflowOptions.find(
    (option) => option.value === data.workflow
  );

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
            <Grid>
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
              <Tooltip title={option.desc}>
                <IconButton>
                  <InfoIcon />
                </IconButton>
              </Tooltip>
            </Grid>
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
              helperText={visitMatch ? "" : "Expected format: xx12345-1"}
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
