import type { MouseEvent } from "react";

import FormLabel from "@mui/material/FormLabel";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import { Info } from "lucide-react";

import { iconSize } from "../../data/form";
import type { Option } from "../../types/workflowFields";

type Props = {
  title?: string;
  info?: string;
  value: string;
  options: Option[];
  onChange: (event: MouseEvent<HTMLElement>, value: string | null) => void;
};

export default function OptionToggle({
  title,
  info,
  value,
  options,
  onChange,
}: Props) {
  const selected = options.find((o) => o.value === value);
  return (
    <Stack>
      {title && (
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
      )}
      <Stack direction="row" spacing={1} alignItems="center">
        <ToggleButtonGroup
          exclusive
          value={value}
          onChange={onChange}
          size="small"
        >
          {options.map((opt) => (
            <ToggleButton key={opt.label} value={opt.value}>
              {opt.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        {selected?.desc && (
          <Tooltip title={selected?.desc ?? ""}>
            <IconButton size="small">
              <Info />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
    </Stack>
  );
}
