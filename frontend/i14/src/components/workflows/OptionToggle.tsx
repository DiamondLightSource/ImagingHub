import type { MouseEvent } from "react";

import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import { Info } from "lucide-react";

import { iconSize } from "../../data/form";
import FieldLabel from "./../../../../shared_components/FieldLabel";

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
    <Stack spacing={0} sx={{ mt: "0px !important" }}>
      {title && <FieldLabel title={title} info={info} />}
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
