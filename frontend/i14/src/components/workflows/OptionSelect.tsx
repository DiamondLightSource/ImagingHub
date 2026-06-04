import React, { FC } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Tooltip,
  Grid,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import type { SelectChangeEvent } from "@mui/material/Select";
import type { Option } from "../../types/workflowFields";

type Props = {
  label: string;
  value: string;
  options: Option[];
  onChange: (e: SelectChangeEvent<string>) => void;
};

const OptionSelect: FC<Props> = ({ label, value, options, onChange }) => {
  const selected = options.find((o) => o.value === value);

  return (
    <FormControl>
      <InputLabel shrink>{label}</InputLabel>
      <Grid>
        <Select
          native
          label={label}
          size="small"
          value={value}
          onChange={onChange}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
        <Tooltip title={selected?.desc ?? ""}>
          <IconButton>
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </Grid>
    </FormControl>
  );
};

export default OptionSelect;
