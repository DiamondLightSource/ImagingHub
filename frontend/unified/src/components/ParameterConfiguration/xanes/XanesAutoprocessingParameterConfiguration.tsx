import { useEffect, useState } from "react";

import CheckboxField from "./../base/CheckboxField";
import ElementField from "./../base/ElementField";
import LayoutCard from "./../base/LayoutCard";
import MultiScanField from "./../base/MultiScanField";
import NumberField from "./../base/NumberField";
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
      <CheckboxField {...props} label="Normalise" parameterName="normalise" />
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
        label="Method"
        desc="The method to use for alignment"
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
            <NumberField
              {...props}
              parameterName="max_fractional_shift"
              label="Maximum fractional shift"
              info="This number is used to define the maximum shift that could be applied to an axis, as a fraction of the size of the axis. Setting it to a higher number results in longer duration of alignment."
              inProps={{ min: 0, max: 1, step: 0.1 }}
            />
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
