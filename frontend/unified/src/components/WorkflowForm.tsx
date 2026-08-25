import React, { FC } from "react";
import {
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Grid,
  Stack,
  FormGroup,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { visitRegex } from "@diamondlightsource/sci-react-ui";
import OptionSelect from "./OptionSelect";
import { Option, WorkflowFormData } from "../types/workflowFields";
import { Technique } from "../types";

export const WorkflowForm: FC = (props: {
  data: WorkflowFormData;
  handleToggleChange: (
    _event: React.MouseEvent<HTMLElement>,
    next: string | null
  ) => void;
  currentShowAllSwitchState: boolean;
  handleShowAllSwitch: (_: React.ChangeEvent<HTMLInputElement>) => void;
  filteredTechniques: Technique[];
  templateOptions: Option[];
  technique: string;
  template: string;
  setTemplate: (_: string) => void;
}) => {
  const visitMatch = visitRegex.exec(props.data.visit);

  const openInNewTab = (url: string) => {
    const w = window.open(url, "_blank");
    w?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = `https://workflows.diamond.ac.uk/templates/${props.template}/${props.data.visit}?outputFolder=${props.data.outpath}`;
    openInNewTab(url);
  };

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
                  value={props.technique}
                  onChange={props.handleToggleChange}
                  aria-label="Technique"
                >
                  {props.filteredTechniques.map((t) => (
                    <ToggleButton key={t} value={t}>
                      {t}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </FormGroup>
            </Stack>
            <OptionSelect
              label="Template"
              value={props.template}
              options={props.templateOptions}
              onChange={(e) => props.setTemplate(e.target.value)}
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
