import LayoutCard from "../base/LayoutCard";
import VisitDirField from "../base/VisitDirField";
import MultiScanField from "../base/MultiScanField";

import type { TemplateComponentProps } from "../../types";

export const DpcParameterConfiguration = (props: TemplateComponentProps) => {
  return (
    <LayoutCard>
      <MultiScanField {...props} />
      <VisitDirField
        {...props}
        label="Output folder"
        parameterName="outputFolder"
      />
    </LayoutCard>
  );
};
