import IconButton from "@mui/material/IconButton";
import FormLabel from "@mui/material/FormLabel";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";

import { Info } from "lucide-react";

import { iconSize } from "./data/ui";

type FieldLabelProps = {
  title: string;
  info?: string;
};

const FieldLabel = ({ title, info }: FieldLabelProps) => {
  return (
    <Stack direction="row" alignItems="center">
      <FormLabel>{title}</FormLabel>
      {info && (
        <Tooltip title={info}>
          <IconButton aria-label="Information" size="small">
            <Info size={iconSize} />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  );
};

export default FieldLabel;
