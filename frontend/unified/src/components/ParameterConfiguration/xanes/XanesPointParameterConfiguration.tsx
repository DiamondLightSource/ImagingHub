import { useEffect, useState } from "react";

import ElementField from "./../base/ElementField";
import LayoutCard from "./../base/LayoutCard";
import SingleScanField from "./../base/SingleScanField";
import VisitDirField from "./../base/VisitDirField";

import type { TemplateComponentProps } from "./../../../types";

export const XanesPointParameterConfiguration = (
  props: TemplateComponentProps
) => {
  return (
    <LayoutCard>
      <SingleScanField {...props} />
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
