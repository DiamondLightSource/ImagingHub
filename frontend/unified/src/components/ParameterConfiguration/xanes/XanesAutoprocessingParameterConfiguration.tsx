import { useEffect, useState } from "react";

import ElementField from "./../base/ElementField";
import LayoutCard from "./../base/LayoutCard";
import MultiScanField from "./../base/MultiScanField";
import VisitDirField from "./../base/VisitDirField";

import type { TemplateComponentProps } from "./../../../types";

export const XanesAutoprocessingParameterConfiguration = (
  props: TemplateComponentProps
) => {
  return (
    <LayoutCard>
      <MultiScanField {...props} />
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
      <VisitDirField
        {...props}
        label="Output folder"
        parameterName="outputFolder"
      />
    </LayoutCard>
  );
};
