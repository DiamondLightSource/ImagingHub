import { useEffect, useState } from "react";

import ElementSelect from "./../../../../../shared_components/ElementSelect";

import LayoutCard from "./../base/LayoutCard";
import SingleScanField from "./../base/SingleScanField";
import VisitDirField from "./../base/VisitDirField";

import type { TemplateComponentProps } from "./../../../types";

export const XanesPointParameterConfiguration = (
  props: TemplateComponentProps
) => {
  const { setParameters } = props;
  const [edgeElement, setEdgeElement] = useState({
    element: "",
    transition: "",
  });

  useEffect(() => {
    setParameters((prev) => ({
      ...prev,
      edgeElement: edgeElement.element,
      edgeTransition: edgeElement.transition,
    }));
  }, [edgeElement]);

  return (
    <LayoutCard>
      <SingleScanField {...props} />
			<ElementSelect
        title="Edge Element"
        info="Line group to be aligned"
        value={edgeElement}
        onChange={(value) => setEdgeElement(value)}
      />
      <VisitDirField
        {...props}
        label="Output folder"
        parameterName="outputFolder"
      />
    </LayoutCard>
  );
};
