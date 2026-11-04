import {
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import { X } from "lucide-react";
import { useState } from "react";

type ScanSearchProps = {
  setSearchScanNumber: (v: string | null) => void;
};
export const ScanSearch = ({ setSearchScanNumber }: ScanSearchProps) => {
  const [number, setNumber] = useState("");

  return (
    <Stack direction="row" spacing={2}>
      <TextField
        label="Scan number"
        value={number}
        onChange={(e) => {
          setNumber(e.target.value);
        }}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                {number !== "" && (
                  <IconButton
                    edge="end"
                    onClick={() => {
                      setNumber("");
                      setSearchScanNumber(null);
                    }}
                  >
                    <X />
                  </IconButton>
                )}
              </InputAdornment>
            ),
          },
        }}
      />
      <Button
        variant="contained"
        onClick={(_) => {
          if (number === "") {
            setSearchScanNumber(null);
          } else {
            setSearchScanNumber(number);
          }
        }}
      >
        Search
      </Button>
    </Stack>
  );
};
