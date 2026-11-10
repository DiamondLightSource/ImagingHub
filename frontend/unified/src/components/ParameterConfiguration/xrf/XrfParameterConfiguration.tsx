import { useState } from "react";

import ElementField from "./../base/ElementField";
import LayoutCard from "./../base/LayoutCard";
import MultiEdgeField from "./../base/MultiEdgeField";
import MultiScanField from "./../base/MultiScanField";
import VisitDirField from "./../base/VisitDirField";

import type { TemplateComponentProps } from "./../../../types";

export const XrfParameterConfiguration = (props: TemplateComponentProps) => {
  return (
    <LayoutCard>
      <MultiScanField {...props} />
      <MultiEdgeField {...props} />
      <ElementField
        {...props}
        title="Transition to Align"
        info="Line group to be used for tracking"
        parameterNames={["elementToAlign", "transitionToAlign"]}
      />
      <VisitDirField
        {...props}
        label="Output folder"
        parameterName="outputFolder"
      />
    </LayoutCard>
  );
};
