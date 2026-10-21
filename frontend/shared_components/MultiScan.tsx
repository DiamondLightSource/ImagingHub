import { Info } from "lucide-react";

import FormLabel from "@mui/material/FormLabel";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";

import { iconSize } from "./data/ui";
import type { MultiScanT } from "./types";

type MultiScanProps = {
  title?: string;
  info?: string;
  value: MultiScanT;
  onChange: (value: MultiScanT) => void;
};

const MultiScan = ({ title, info, value, onChange }: MultiScanProps) => {
  return (
    <Stack spacing={0} sx={{ mt: "0px !important" }}>
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
        <TextField
          size="small"
          label="Start"
          value={value.start}
          onChange={(e) => onChange({ ...value, start: e.target.value })}
        />

        <TextField
          size="small"
          label="End"
          value={value.end}
          onChange={(e) => onChange({ ...value, end: e.target.value })}
        />

        <TextField
          size="small"
          label="Excluded"
          value={value.excluded}
          onChange={(e) => onChange({ ...value, excluded: e.target.value })}
          slotProps={{
            input: {
              endAdornment: (
                <Tooltip title="Accepts integers and ranges separated by spaces or commas, e.g. 1 2, 5-9, 11.">
                  <InputAdornment position="end">
                    <Info />
                  </InputAdornment>
                </Tooltip>
              ),
            },
          }}
        />
      </Stack>
    </Stack>
  );
};

export default MultiScan;
