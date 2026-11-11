import { useEffect, useState } from "react";

import ElementField from "./../base/ElementField";
import LayoutCard from "./../base/LayoutCard";
import NumberField from "./../base/NumberField";
import VisitDirField from "./../base/VisitDirField";

import type { TemplateComponentProps } from "./../../../types";

export const XanesPointParameterConfiguration = (
  props: TemplateComponentProps
) => {
  return (
    <LayoutCard>
      <NumberField {...props} label="Scan Number" parameterName="scanNumber" />
      <ElementField
        {...props}
        title="Edge Element"
        info="Line group to be aligned"
        parameterNames={["edgeElement", "edgeTransition"]}
      />
      <VisitDirField
        {...props}
        label="Output folder"
        parameterName="outputFolder"
      />
    </LayoutCard>
  );
};
