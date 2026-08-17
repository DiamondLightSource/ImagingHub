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
  FormGroup,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { visitRegex } from "@diamondlightsource/sci-react-ui";

import { initialData } from "../data/form";
import { templateOptions } from "../data/templates";
import OptionSelect from "./OptionSelect";

import type { WorkflowFormData, Option } from "../types/workflowFields";

export const techniques = ["dpc", "xanes", "xrd", "ptycho"] as const;

export type ToggleGroup = (typeof techniques)[number];

export const BeamlineTechniquesArray = {
  I12: ["tomography"],
  "I13-1": ["dpc", "xanes", "xrd", "Ptycho", "tomography"],
  I14: ["dpc", "xanes", "xrd"],
  ePSIC: ["dpc", "NBED", "ptycho"],
  all: ["dpc", "xanes", "xrd", "ptycho", "nbed", "tomography"],
};

export const WorkflowForm: FC = (props: {
  data: any;
  handleToggleChange: any;
  setData: any;
  currentShowAllSwitchState: any;
  handleShowAllSwitch: any;
  filteredTechniques: any;
  templateoptions: any;
}) => {
  const visitMatch = visitRegex.exec(props.data.visit);

  const openInNewTab = (url: string) => {
    const w = window.open(url, "_blank");
    w?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = `https://workflows.diamond.ac.uk/templates/${props.data.template}/${data.visit}?outputFolder=${props.data.outpath}`;
    openInNewTab(url);
  };

  console.log(`data: ${JSON.stringify(props.data)}`);
  console.log(`props.filteredTechniques: ${props.filteredTechniques}`);
  console.log(`props.data.template: ${props.data.template}`);

  return (
    <Grid container justifyContent="left" spacing={1}>
      <Grid item s={6}>
        <form onSubmit={handleSubmit}>
          <Stack direction="column" spacing={2}>
            <Stack direction="column" spacing={0}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={props.currentShowAllSwitchState}
                      onChange={props.handleShowAllSwitch}
                    />
                  }
                  label="Show all"
                />
                <ToggleButtonGroup
                  exclusive
                  value={props.data.technique}
                  onChange={props.handleToggleChange}
                  aria-label="Technique"
                >
                  {props.filteredTechniques.map((t) => (
                    <ToggleButton key={t} value={t}>
                      {t.toUpperCase()}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </FormGroup>
            </Stack>
            <OptionSelect
              label="Template"
              value={props.data.template}
              options={props.templateoptions} //{props.filteredTechniques}
              onChange={(e) =>
                props.setData((prev) => ({ ...prev, template: e.target.value }))
              }
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
