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

import { initialData } from "../../data/form";
import OptionSelect from "./OptionSelect";
import { dataToOptions } from "../../api/services";
import { templateOptions } from "../../data/templates";
import visitArray from "../../data/visits.json";

import type { WorkflowFormData, Option } from "../../types/workflowFields";

export const WorkflowForm: FC = () => {
  const techniques = ["dpc", "xanes", "xrd"] as const;
  type ToggleGroup = (typeof techniques)[number];
  const getFilteredTemplates = (toggle: ToggleGroup): Option[] => {
    return (templateOptions ?? []).filter((o) => o.value.includes(toggle));
  };
  const visitOptions: Option[] = useMemo(() => dataToOptions(visitArray), []);

  const [data, setData] = useState<WorkflowFormData>(() => {
    const defaultTechnique =
      techniques.find((t) => initialData.template.includes(t)) ?? techniques[0];
    return {
      ...initialData,
      visit: visitOptions[0]?.value ?? initialData.visit,
      technique: defaultTechnique,
    };
  });

  const filteredTemplateOptions: Option[] = getFilteredTemplates(
    data.technique
  );

  const handleToggleChange = (
    _event: React.MouseEvent<HTMLElement>,
    next: ToggleGroup | null
  ) => {
    if (!next) return;
    const filteredTemplates = getFilteredTemplates(next);
    setData((prev) => ({
      ...prev,
      technique: next,
      template: filteredTemplates[0].value,
    }));
  };

  const openInNewTab = (url: string) => {
    const w = window.open(url, "_blank");
    w?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = `https://workflows.diamond.ac.uk/templates/${data.template}/${data.visit}?outputFolder=${data.outpath}`;
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
                value={data.technique}
                onChange={handleToggleChange}
                aria-label="Technique"
              >
                {techniques.map((t) => (
                  <ToggleButton key={t} value={t}>
                    {t.toUpperCase()}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Stack>
            <OptionSelect
              label="Template"
              value={data.template}
              options={filteredTemplateOptions}
              onChange={(e) =>
                setData((prev) => ({ ...prev, template: e.target.value }))
              }
            />
            <OptionSelect
              label="Visit"
              value={data.visit}
              options={visitOptions}
              onChange={(e) =>
                setData((prev) => ({ ...prev, visit: e.target.value }))
              }
            />

            <TextField
              name="outpath"
              label="Output path"
              variant="outlined"
              size="small"
              placeholder="Output path"
              type="text"
              value={data.outpath}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setData((prev) => ({ ...prev, outpath: e.target.value }));
              }}
            />

            <Button variant="contained" type="submit">
              Open workflow form in a new tab
            </Button>
          </Stack>
        </form>
      </Grid>
    </Grid>
  );
};

export default WorkflowForm;
