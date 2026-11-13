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
import Row from "./../../../../../shared_components/Row";
import Section from "./../../../../../shared_components/Section";
import TextField from "@mui/material/TextField";

import { initialData } from "./../../../../../shared_components/data/xrfForm";
import {
  alignmentSectionOptions,
  reconsMethodOptions,
} from "./../../../../../shared_components/data/xrf";
import type { TemplateComponentProps } from "./../../../types";

export const XrfParameterConfiguration = (props: TemplateComponentProps) => {
  const { setParameters, visitDirpath } = props;
  const [data, setData] = useState(initialData);
  const updateParams = (name: string, v: string) => {
    setData((prev) => ({ ...prev, [name]: v }));
    setParameters((prev) => ({ ...prev, [name]: v }));
  };
  return (
    <LayoutCard>
      <Section title="Scans">
        <MultiScanField {...props} />
      </Section>
      <Section title="Stacking">
        <Row>
          <CheckboxField
            {...props}
            label="Stack"
            parameterName="stacking"
            desc="Set this option to False if the data has already been stacked, and provide the path to the stacked data."
          />
          <TextField
            size="small"
            label="Path to stack"
            value={data.pathToStack}
            onChange={(e) => updateParams("pathToStack", e.target.value)}
          />
        </Row>
      </Section>
      <Section title="Alignment">
        <Row>
          <MultiEdgeField {...props} />
          <ElementField
            {...props}
            title="Transition to Align"
            info="Line group to be used for tracking"
            parameterNames={["elementToAlign", "transitionToAlign"]}
          />
        </Row>
        <Row>
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
        </Row>
        <CheckboxField {...props} label="Normalise" parameterName="normalise" />
      </Section>
      <Section title="Reconstruction">
        <Row>
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
        </Row>
      </Section>
      <TextField
        size="small"
        label="Output Folder"
        value={data.outputFolder}
        onChange={(e) => updateParams("outputFolder", e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start" sx={{ mr: 0 }}>
                {visitDirpath}processing/workflows/
              </InputAdornment>
            ),
          },
        }}
      />
    </LayoutCard>
  );
};
