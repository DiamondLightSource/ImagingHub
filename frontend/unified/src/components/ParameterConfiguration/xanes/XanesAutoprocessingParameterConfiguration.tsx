import { useEffect, useState } from "react";

import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";

import { Info } from "lucide-react";

import ElementField from "./../base/ElementField";
import LayoutCard from "./../base/LayoutCard";
import MultiScanField from "./../base/MultiScanField";
import VisitDirField from "./../base/VisitDirField";

import { initialData } from "./../../../../../shared_components/data/xanesForm";
import {
  bruteOptions,
  methodOptions,
} from "./../../../../../shared_components/data/xanes";
import OptionToggle from "./../../../../../shared_components/OptionToggle";
import Section from "./../../../../../shared_components/Section";

import type { TemplateComponentProps } from "./../../../types";

export const XanesAutoprocessingParameterConfiguration = (
  props: TemplateComponentProps
) => {
  const { setParameters } = props;
  const [data, setData] = useState(initialData);

  return (
    <LayoutCard>
      <MultiScanField {...props} />
      <FormControlLabel
        label="Normalise"
        control={
          <Checkbox
            checked={Boolean(data.normalise)}
            onChange={(e) => {
              setData((prev) => ({ ...prev, normalise: e.target.checked }));
              setParameters((prev) => ({
                ...prev,
                normalise: e.target.checked,
              }));
            }}
            sx={{ p: 0.5 }}
          />
        }
      />
      <ElementField
        {...props}
        title="Edge Element"
        info="Line group to be aligned"
        parameterNames={["edgeElement", "edgeTransition"]}
      />
      <ElementField
        {...props}
        title="Transition to Align"
        info="Line group to be used for tracking"
        parameterNames={["elementToAlign", "transitionToAlign"]}
      />
      <OptionToggle
        title="Method"
        info="The method to use for alignment"
        value={data.method}
        options={methodOptions}
        onChange={(_, newValue) => {
          if (newValue === null) return; // Prevent an unselected state
          setData((prev) => ({ ...prev, method: newValue }));
          setParameters((prev) => ({ ...prev, method: newValue }));
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
              setParameters((prev) => ({ ...prev, brute: newValue }));
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
                  setParameters((prev) => ({
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
      <VisitDirField
        {...props}
        label="Output folder"
        parameterName="outputFolder"
      />
    </LayoutCard>
  );
};
