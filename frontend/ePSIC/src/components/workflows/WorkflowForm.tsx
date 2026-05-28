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
  workflow: "e02-mib2x",
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
      label: "e02 mib2x",
      value: "e02-mib2x",
      desc: "Mib Conversion: convert a single mib file into a 4D STEM hdf5 file and corresponding meta data.",
    },
    {
      label: "e02mib2x auto",
      value: "e02mib2x-auto",
      desc: "Batch Mib conversion: Search a given directory for uncovered mib files. Then convert all unconvered mib files into hdf5 files and corresponding Meta data",
    },
    {
      label: "e02virtual image auto",
      value: "e02virtual-image-auto",
      desc: "Search a given visit and sample sub directory for converted hdf5 files. Then take the hdf5 files and convert them into a selection of virtual images such Annual Dark Field (ADF), Bright Field (BF), Differentional Phase constrast (DPC) and Pallax images",
    },
  ];

  const option = workflowOptions.find(
    (option) => option.value === data.workflow
  );

  return (
    <Grid container justifyContent="center" spacing={1}>
      <Grid size={3}>
        <Typography variant="h4">ePSIC Workflows</Typography>

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
