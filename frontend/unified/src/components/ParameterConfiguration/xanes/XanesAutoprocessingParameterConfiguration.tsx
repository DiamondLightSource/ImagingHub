import { useEffect, useState } from "react";

import ElementSelect from "./../../../../../shared_components/ElementSelect";

import LayoutCard from "./../base/LayoutCard";
import MultiScanField from "./../base/MultiScanField";
import VisitDirField from "./../base/VisitDirField";

import type { TemplateComponentProps } from "./../../../types";

export const XanesAutoprocessingParameterConfiguration = (
  props: TemplateComponentProps
) => {
  const { setParameters } = props;
  const [edgeElement, setEdgeElement] = useState({
    element: "",
    transition: "",
  });
  const [elementToAlign, setElementToAlign] = useState({
    element: "",
    transition: "",
  });

  useEffect(() => {
    setParameters((prev) => ({
      ...prev,
      edgeElement: edgeElement.element,
      edgeTransition: edgeElement.transition,
      elementToAlign: elementToAlign.element,
      transitionToAlign: elementToAlign.transition,
    }));
  }, [edgeElement, elementToAlign]);

  return (
    <LayoutCard>
      <MultiScanField {...props} />
      <ElementSelect
        title="Edge Element"
        info="Line group to be aligned"
        value={edgeElement}
        onChange={(value) => setEdgeElement(value)}
      />
      <ElementSelect
        title="Transition to Align"
        info="Line group to be used for tracking"
        value={elementToAlign}
        onChange={(value) => setElementToAlign(value)}
      />
      <VisitDirField
        {...props}
        label="Output folder"
        parameterName="outputFolder"
      />
    </LayoutCard>
  );
};
