import IconButton from "@mui/material/IconButton";
import FormLabel from "@mui/material/FormLabel";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";

import { Info } from "lucide-react";

import { iconSize } from "./data/ui";

type FieldLabelProps = {
  label: string;
  desc?: string;
};

const FieldLabel = ({ label, desc }: FieldLabelProps) => {
  return (
    <Stack direction="row" alignItems="center">
      <FormLabel>{label}</FormLabel>
      {desc && (
        <Tooltip title={desc}>
          <IconButton aria-label="Information" size="small">
            <Info size={iconSize} />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  );
};

export default FieldLabel;
