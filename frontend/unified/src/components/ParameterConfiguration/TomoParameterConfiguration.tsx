import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";

const CorSweepParameterConfiguration = () => {
  return (
    <>
      <FormGroup>
        <FormControlLabel
          label="Apply normalisation to raw data"
          control={<Checkbox />}
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
  return (
    <>
      {
        TEMPLATE_TO_COMPONENT_MAPPING[
          template as keyof typeof TEMPLATE_TO_COMPONENT_MAPPING
        ]
      }
    </>
  );
};
