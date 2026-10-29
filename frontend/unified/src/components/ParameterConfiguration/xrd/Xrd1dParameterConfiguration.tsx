import LayoutCard from "./../base/LayoutCard";
import MultiScanField from "./../base/MultiScanField";
import VisitDirField from "./../base/VisitDirField";

import type { TemplateComponentProps } from "./../../../types";

export const Xrd1dParameterConfiguration = (props: TemplateComponentProps) => {
  return (
    <LayoutCard>
      <MultiScanField {...props} />
      <VisitDirField
        {...props}
        label="Config folder"
        parameterName="xrdProcessConfigUpload"
      />
      <VisitDirField
        {...props}
        label="Output folder"
        parameterName="outputFolder"
      />
    </LayoutCard>
  );
};
