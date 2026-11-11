import { useState } from "react";

import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";

import CheckboxField from "./../base/CheckboxField";
import ElementField from "./../base/ElementField";
import LayoutCard from "./../base/LayoutCard";
import MultiEdgeField from "./../base/MultiEdgeField";
import MultiScanField from "./../base/MultiScanField";
import NumberField from "./../base/NumberField";
import OptionSelectField from "../base/OptionSelectField";
import Section from "./../../../../../shared_components/Section";
import TextField from "@mui/material/TextField";
import VisitDirField from "./../base/VisitDirField";

import { initialData } from "./../../../../../shared_components/data/xrfForm";
import {
  alignmentSectionOptions,
  reconsMethodOptions,
} from "./../../../../../shared_components/data/xrf";
import type { TemplateComponentProps } from "./../../../types";

export const XrfParameterConfiguration = (props: TemplateComponentProps) => {
  const { setParameters } = props;
  const [data, setData] = useState(initialData);
  const updateParams = (name: string, v: string) => {
    setData((prev) => ({ ...prev, [name]: v }));
    setParameters((prev) => ({ ...prev, [name]: v }));
  };
  return (
    <LayoutCard>
      <MultiScanField {...props} />
      <CheckboxField {...props} title="Normalise" />
      <Section title="Staging">
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
          spacing={2}
        >
          <CheckboxField
            {...props}
            label="Stage"
            parameterName="staging"
            info="Use this option if data is on archive and has been re-staged to /dls/staging. Also change prefix to /dls/staging"
          />
          <TextField
            size="small"
            label="Staging prefix"
            value={data.prefix}
            onChange={(e) => updateParams("prefix", e.target.value)}
          />
        </Stack>
      </Section>
      <Section title="Stacking">
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
          spacing={2}
        >
          <CheckboxField
            {...props}
            title="Stack"
            parameterName="stacking"
            info="Set this option to False if the data has already been stacked, and provide the path to the stacked data."
          />
          <TextField
            size="small"
            label="Path to stack"
            value={data.pathToStack}
            onChange={(e) => updateParams("pathToStack", e.target.value)}
          />
        </Stack>
      </Section>
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-evenly",
          alignItems: "flex-start",
        }}
        spacing={2}
      >
        <MultiEdgeField {...props} />
        <ElementField
          {...props}
          title="Transition to Align"
          info="Line group to be used for tracking"
          parameterNames={["elementToAlign", "transitionToAlign"]}
        />
      </Stack>
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
        spacing={2}
      >
        <OptionSelectField
          {...props}
          label="Section for alignment"
          parameterName={"alignmentSection"}
          options={alignmentSectionOptions}
        />
        <NumberField
          {...props}
          parameterName="alignmentBand"
          label="Band width for alignment"
          info="The width of a vertical band of lines in each projections to be used for the initial alignment."
        />
      </Stack>
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
        spacing={2}
      >
        <NumberField
          {...props}
          parameterName="cor"
          label="Centre of rotation"
          info="Optional value for centre of rotation for the tomographic reconstruction, using Vo centering method if not provided."
        />
        <OptionSelectField
          {...props}
          label="Reconstruction method"
          parameterName="reconsMethod"
          options={reconsMethodOptions}
        />
      </Stack>
      <VisitDirField
        {...props}
        label="Output folder"
        parameterName="outputFolder"
      />
    </LayoutCard>
  );
};
