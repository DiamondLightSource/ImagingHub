import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { useState } from "react";

export const CorSweepParameterConfiguration = () => {
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
