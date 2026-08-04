import React, { FC, useMemo, useState } from "react";
import {
  Button,
  FormLabel,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { visitRegex } from "@diamondlightsource/sci-react-ui";

import { initialData } from "../../data/form";
import { workflowOptions } from "../../data/workflows";
import OptionSelect from "./OptionSelect";

import type { WorkflowFormData, Option } from "../../types/workflowFields";

export const WorkflowForm: FC = () => {
  const workflowGroups = ["dpc", "xanes", "xrd"] as const;
  type ToggleGroup = (typeof workflowGroups)[number];
  const getFilteredWorkflows = (toggle: ToggleGroup): Option[] => {
    return (workflowOptions ?? []).filter((o) => o.value.includes(toggle));
  };

  const [data, setData] = useState<WorkflowFormData>(() => {
    const defaultGroup =
      workflowGroups.find((g) => initialData.workflow.includes(g)) ??
      workflowGroups[0];
    return {
      ...initialData,
      group: defaultGroup,
    };
  });

  const visitMatch = visitRegex.exec(data.visit);

  const filteredWorkflowOptions: Option[] = getFilteredWorkflows(
    data.group as ToggleGroup
  );

  const handleToggleChange = (
    _event: React.MouseEvent<HTMLElement>,
    next: ToggleGroup | null
  ) => {
    if (!next) return;
    const filteredWorkflows = getFilteredWorkflows(next);
    setData((prev) => ({
      ...prev,
      group: next,
      workflow: filteredWorkflows[0].value,
    }));
  };

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
            <Stack direction="column" spacing={0}>
              <FormLabel>Technique</FormLabel>
              <ToggleButtonGroup
                exclusive
                value={data.group as ToggleGroup}
                onChange={handleToggleChange}
                aria-label="Workflow group"
              >
                {workflowGroups.map((g) => (
                  <ToggleButton key={g} value={g}>
                    {g.toUpperCase()}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Stack>
            <OptionSelect
              label="Template"
              value={data.workflow}
              options={filteredWorkflowOptions}
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
