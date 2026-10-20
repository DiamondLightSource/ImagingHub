import type { FC, ChangeEvent } from "react";
import React, { useState } from "react";

import { Info } from "lucide-react";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { initialData, techniqueOptions } from "../../data/form";
import { templateOptions } from "../../data/templates";
import { methodOptions, bruteOptions } from "../../data/xanes";

import DynamicArray from "./DynamicArray";
import OptionSelect from "./OptionSelect";
import OptionToggle from "./OptionToggle";
import ElementSelect from "./ElementSelect";
import UserVisits from "./UserVisits";
import Section from "./../../../../shared_components/Section";

import type {
  ElementPair,
  ElementPairArray,
  WorkflowFormData,
  Option,
} from "../../types/workflowFields";

export const WorkflowForm: FC = () => {
  const getFilteredTemplates = (toggle): Option[] => {
    return (templateOptions ?? []).filter((o) => o.value.includes(toggle));
  };

  const [data, setData] = useState<WorkflowFormData>(() => {
    const defaultTechnique =
      techniqueOptions.find((t) => initialData.template.includes(t.value)) ??
      techniqueOptions[0];
    return {
      ...initialData,
      technique: defaultTechnique.value,
    };
  });

  const filteredTemplateOptions: Option[] = getFilteredTemplates(
    data.technique
  );

  const handleToggleChange = (_, newValue) => {
    if (!newValue) return;
    const filteredTemplates = getFilteredTemplates(newValue);
    setData((prev) => ({
      ...prev,
      technique: newValue,
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
    params.set("method", data.method);
    params.set("brute", data.brute);
    params.set("max_fractional_shift", data.max_fractional_shift);
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
            <OptionToggle
              title="Technique"
              value={data.technique}
              options={techniqueOptions}
              onChange={handleToggleChange}
            />
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
            {"xanes" === data.template && (
              <>
                <OptionToggle
                  title="Method"
                  info="The method to use for alignment"
                  value={data.method}
                  options={methodOptions}
                  onChange={(_, newValue) => {
                    if (newValue === null) return; // Prevent an unselected state
                    setData((prev) => ({ ...prev, method: newValue }));
                  }}
                />
                {"mutual" === data.method && (
                  <Section title="Method Parameters">
                    <OptionToggle
                      value={data.brute}
                      options={bruteOptions}
                      onChange={(_, newValue) => {
                        if (newValue === null) return;
                        setData((prev) => ({ ...prev, brute: newValue }));
                      }}
                    />
                    {data.brute && (
                      <Stack direction="row" alignItems="center">
                        <TextField
                          name="max_fractional_shift"
                          label="Maximum fractional shift"
                          variant="outlined"
                          size="small"
                          type="number"
                          sx={{ minWidth: "160px" }}
                          inputProps={{ min: 0, max: 1, step: 0.1 }}
                          value={data.max_fractional_shift}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            const value = e.target.value;
                            setData((prev) => ({
                              ...prev,
                              max_fractional_shift: value,
                            }));
                          }}
                        />
                        <Tooltip title="This number is used to define the maximum shift that could be applied to an axis, as a fraction of the size of the axis. Setting it to a higher number results in longer duration of alignment.">
                          <IconButton>
                            <Info />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    )}
                  </Section>
                )}
              </>
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
