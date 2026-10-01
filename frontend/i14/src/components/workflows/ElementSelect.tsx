import { Info } from "lucide-react";

import FormLabel from "@mui/material/FormLabel";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";

import OptionPanel from "./OptionPanel";
import { elementOptions, transitionOptions } from "../../data/elements";

interface ElementSelectValue {
  element: string;
  transition: string;
}

interface ElementSelectProps {
  title?: string;
  info?: string;
  value: ElementSelectValue;
  onChange: (value: ElementSelectValue) => void;
}

export default function ElementSelect({
  title,
  info,
  value,
  onChange,
}: ElementSelectProps) {
  return (
    <Stack spacing={0} sx={{ mt: "0px !important" }}>
      {title && (
        <Stack direction="row" alignItems="center">
          <FormLabel>{title}</FormLabel>
          {info && (
            <Tooltip title={info}>
              <IconButton aria-label="Information" size="small">
                <Info />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      )}

      <Stack direction="row" spacing={1} alignItems="center">
        <OptionPanel
          useGrid
          value={value.element}
          options={elementOptions}
          onChange={(element) => onChange({ ...value, element })}
        />
        <p>-</p>
        <OptionPanel
          value={value.transition}
          options={transitionOptions}
          onChange={(transition) => onChange({ ...value, transition })}
        />
      </Stack>
    </Stack>
  );
}
