import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { useState } from "react";

const CorSweepParameterConfiguration = () => {
  const [applyNormalisation, setApplyNormalisation] = useState<boolean>(true);

  return (
    <>
      <FormGroup>
        <FormControlLabel
          label="Apply normalisation to raw data"
          control={
            <Checkbox
              checked={applyNormalisation}
              onChange={(e) => setApplyNormalisation(e.target.checked)}
            />
          }
        />
      </FormGroup>
    </>
  );
};

const TEMPLATE_TO_COMPONENT_MAPPING = {
  "httomo-cor-sweep": <CorSweepParameterConfiguration />,
};

type TomoParameterConfigurationProps = {
  template: string;
};

export const TomoParameterConfiguration = ({
  template,
}: TomoParameterConfigurationProps) => {
  const NoComponentFound = (
    <p>No available component for {template} template</p>
  );

  return (
    <>
      {TEMPLATE_TO_COMPONENT_MAPPING[
        template as keyof typeof TEMPLATE_TO_COMPONENT_MAPPING
      ] ?? NoComponentFound}
    </>
  );
};
