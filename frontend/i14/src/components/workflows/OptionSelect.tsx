import React, { FC } from "react";

import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";

import { Info } from "lucide-react";

import type { SelectChangeEvent } from "@mui/material/Select";
import type { Option } from "../../types/workflowFields";

type Props = {
  label: string;
  value?: string;
  options: Option[];
  onChange: (e: SelectChangeEvent<string>) => void;
};

const OptionSelect: FC<Props> = ({ label, value, options, onChange }) => {
  const selectedValue = value ?? options[0]?.value ?? "";
  const selected = options.find((o) => o.value === selectedValue);

  return (
    <FormControl>
      <InputLabel shrink>{label}</InputLabel>

      <Stack direction="row" alignItems="center">
        <Select
          native
          label={label}
          size="small"
          value={selectedValue}
          onChange={onChange}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>

        {selected?.desc && (
          <Tooltip title={selected?.desc ?? ""}>
            <IconButton size="small">
              <Info />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
    </FormControl>
  );
};

export default OptionSelect;
