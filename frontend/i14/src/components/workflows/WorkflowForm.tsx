import type { FC, ChangeEvent } from "react";
import React, { useState } from "react";

import Button from "@mui/material/Button";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";

import { initialData } from "../../data/form";
import { templateOptions } from "../../data/templates";

import DynamicArray from "./DynamicArray";
import OptionSelect from "./OptionSelect";
import ElementSelect from "./ElementSelect";
import UserVisits from "./UserVisits";

import type {
  ElementPair,
  ElementPairArray,
  WorkflowFormData,
  Option,
} from "../../types/workflowFields";

export const WorkflowForm: FC = () => {
  const techniques = ["dpc", "xanes", "xrd", "xrf"] as const;
  type ToggleGroup = (typeof techniques)[number];
  const getFilteredTemplates = (toggle: ToggleGroup): Option[] => {
    return (templateOptions ?? []).filter((o) => o.value.includes(toggle));
  };

  const [data, setData] = useState<WorkflowFormData>(() => {
    const defaultTechnique =
      techniques.find((t) => initialData.template.includes(t)) ?? techniques[0];
    return {
      ...initialData,
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

  const getElementString = () => {
    const params = new URLSearchParams();
    const { edgeElement, elementToAlign, template } = data;
    const multiEdgeArray = data.edgeElementArray.map(
      (item: ElementPairArray) => ({
        edgeElement: item.element,
        edgeTransition: item.transition,
      })
    );
    if (["xanes-sparse", "xanes"].includes(template)) {
      params.set("edgeElement", edgeElement.element);
      params.set("edgeTransition", edgeElement.transition);
    }
    if (["xrf-tomography", "xanes"].includes(template)) {
      params.set("elementToAlign", elementToAlign.element);
      params.set("transitionToAlign", elementToAlign.transition);
    }
    if (template === "xrf-tomography") {
      params.set("multiEdge", JSON.stringify(multiEdgeArray));
    }
    return params;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = getElementString();
    params.set("outputFolder", data.outpath);
    const url = `https://workflows.diamond.ac.uk/templates/${data.template}/${data.visit}?${params}`;
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

            <UserVisits
              value={data.visit}
              onChange={(e) =>
                setData((prev) => ({ ...prev, visit: e.target.value }))
              }
              onInitialValue={(value) =>
                setData((prev) => ({ ...prev, visit: value }))
              }
            />

            {["xrf-tomography"].includes(data.template) && (
              <>
                <DynamicArray<ElementPairArray>
                  title="Edge Element"
                  desc="Line group to be aligned"
                  items={data.edgeElementArray}
                  onChange={(updatedItems) =>
                    setData((prev) => ({
                      ...prev,
                      edgeElementArray: updatedItems,
                    }))
                  }
                  createItem={(id) => ({
                    id,
                    element: "H",
                    transition: "Ka",
                  })}
                  renderItem={(item, onUpdate) => (
                    <ElementSelect
                      value={{
                        element: item.element,
                        transition: item.transition,
                      }}
                      onChange={({ element, transition }) => {
                        onUpdate({ ...item, element, transition });
                      }}
                    />
                  )}
                />
              </>
            )}

            {["xanes-sparse", "xanes"].includes(data.template) && (
              <ElementSelect
                title="Edge Element"
                info="Line group to be aligned"
                value={data.edgeElement}
                onChange={(value) =>
                  setData((prev) => ({
                    ...prev,
                    edgeElement: value,
                  }))
                }
              />
            )}

            {["xrf-tomography", "xanes"].includes(data.template) && (
              <ElementSelect
                title="Transition to Align"
                info="Line group to be used for tracking"
                value={data.elementToAlign}
                onChange={(value) =>
                  setData((prev) => ({
                    ...prev,
                    elementToAlign: value,
                  }))
                }
              />
            )}

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
