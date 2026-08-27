import React, { FC } from "react";
import {
  ToggleButton,
  ToggleButtonGroup,
  Grid,
  Stack,
  FormGroup,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { Option, Technique } from "../types";

export const WorkflowForm: FC = (props: {
  handleChangeTechnique: (
    _event: React.MouseEvent<HTMLElement>,
    technique: string | null
  ) => void;
  showAllTechniques: boolean;
  handleShowAllTechniques: (_: React.ChangeEvent<HTMLInputElement>) => void;
  filteredTechniques: Technique[];
  templateOptions: Option[];
  technique: string;
  template: string;
  setTemplate: (_: string) => void;
}) => {
  const openInNewTab = (url: string) => {
    const w = window.open(url, "_blank");
    w?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = `https://workflows.diamond.ac.uk/templates/${props.template}`;
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
                      checked={props.showAllTechniques}
                      onChange={props.handleShowAllTechniques}
                    />
                  }
                  label="Show all"
                />
                <ToggleButtonGroup
                  exclusive
                  value={props.technique}
                  onChange={props.handleChangeTechnique}
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
          </Stack>
        </form>
      </Grid>
    </Grid>
  );
};

export default WorkflowForm;
