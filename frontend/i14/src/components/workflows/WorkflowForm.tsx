import React, { FC, useMemo, useState } from "react";
import { Button, Grid, Stack, TextField, Typography } from "@mui/material";
import { visitRegex } from "@diamondlightsource/sci-react-ui";

import { initialData } from "../../data/form";
import { workflowOptions } from "../../data/workflows";
import OptionSelect from "./OptionSelect";

import type { WorkflowFormData, Option } from "../../types/workflowFields";

export const WorkflowForm: FC = () => {
  const [data, setData] = useState<FormData>(initialData);
  const visitMatch = visitRegex.exec(data.visit);

  const openInNewTab = (url: string) => {
    const w = window.open(url, "_blank");
    w?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = `https://workflows.diamond.ac.uk/templates/${data.workflow}/${data.visit}`;
    openInNewTab(url);
  };

  return (
    <Grid container justifyContent="center" spacing={1}>
      <Grid item s={6}>
        <Typography variant="h4">I14 Workflows</Typography>
        <br />
        <form onSubmit={handleSubmit}>
          <Stack direction="column" spacing={2}>
            <OptionSelect
              label="Workflow"
              value={data.workflow}
              options={workflowOptions}
              onChange={(e) =>
                setData((prev) => ({ ...prev, workflow: e.target.value }))
              }
            />

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
              Open workflow form in a new tab
            </Button>
          </Stack>
        </form>
      </Grid>
    </Grid>
  );
};

export default WorkflowForm;
