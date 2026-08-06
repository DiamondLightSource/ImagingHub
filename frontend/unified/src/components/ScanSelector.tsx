import React from "react";
import {
  Chip,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
  InputAdornment,
  IconButton,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";

enum ScanSelectionMode {
  Single = "Single",
  Multiple = "Multiple",
}

enum MultiScanSelectionMode {
  Manual = "Manual",
  Range = "Range",
}

const SingleScanSelector: React.FC = () => {
  const [textInputValue, setTextInputValue] = useState<string>("");
  return (
    <Stack>
      <TextField
        label="Scan number"
        value={textInputValue}
        type="number"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setTextInputValue(e.currentTarget.value);
        }}
      />
    </Stack>
  );
};

const MultiScanSelector: React.FC = () => {
  const [mode, setMode] = useState<MultiScanSelectionMode>(
    MultiScanSelectionMode.Range
  );

  return (
    <>
      <ToggleButtonGroup
        exclusive
        value={mode}
        onChange={(_, toggleButtonLabel: string) => {
          if (toggleButtonLabel === MultiScanSelectionMode.Manual) {
            setMode(MultiScanSelectionMode.Manual);
          } else if (toggleButtonLabel === MultiScanSelectionMode.Range) {
            setMode(MultiScanSelectionMode.Range);
          }
        }}
      >
        <ToggleButton
          sx={{ textTransform: "none" }}
          value={MultiScanSelectionMode.Manual}
        >
          {MultiScanSelectionMode.Manual}
        </ToggleButton>
        <ToggleButton
          sx={{ textTransform: "none" }}
          value={MultiScanSelectionMode.Range}
        >
          {MultiScanSelectionMode.Range}
        </ToggleButton>
      </ToggleButtonGroup>
      {mode === MultiScanSelectionMode.Manual ? (
        <MultiScanManualSelector />
      ) : (
        <MultiScanRangeSelector />
      )}
    </>
  );
};

const MultiScanRangeSelector: React.FC = () => {
  const [start, setStart] = useState<string>("1");
  const [stop, setStop] = useState<string>("2");
  const [step, setStep] = useState<string>("1");

  return (
    <Stack direction="row" spacing={2}>
      <TextField
        label="Start"
        type="number"
        value={Number(start)}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setStart(e.target.value)
        }
      />
      <TextField
        label="Stop"
        type="number"
        value={Number(stop)}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setStop(e.target.value)
        }
      />
      <TextField
        label="Step"
        type="number"
        value={Number(step)}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setStep(e.target.value)
        }
      />
    </Stack>
  );
};

const MultiScanManualSelector: React.FC = () => {
  const [textInputValue, setTextInputValue] = useState<string>("4");
  const [scanIds, setScanIds] = useState<number[]>([1, 2, 3]);

  const handleDeleteScanIdChip = (idToDelete: number) => {
    setScanIds((ids: number[]) => ids.filter((id) => id !== idToDelete));
  };

  const handleClickAddScanIdButton = (idToAdd: number) => {
    if (scanIds.includes(idToAdd)) {
      return;
    }
    setScanIds([...scanIds, idToAdd]);
    setTextInputValue(String(Number(textInputValue) + 1));
  };

  return (
    <Stack spacing={2}>
      <TextField
        label="Scan number"
        value={textInputValue}
        type="number"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setTextInputValue(e.currentTarget.value);
        }}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={(_) =>
                    handleClickAddScanIdButton(Number(textInputValue))
                  }
                >
                  <AddIcon />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
      <Box maxWidth={300}>
        {scanIds.map((scanId: number) => {
          return (
            <Chip
              key={scanId}
              label={scanId}
              onDelete={(_) => handleDeleteScanIdChip(scanId)}
            ></Chip>
          );
        })}
      </Box>
    </Stack>
  );
};

export const ScanSelector: React.FC = () => {
  const [scanSelectionMode, setScanSelectionMode] = useState<ScanSelectionMode>(
    ScanSelectionMode.Single
  );

  return (
    <Stack direction="column" spacing={2} alignItems={"start"}>
      <ToggleButtonGroup
        exclusive
        value={scanSelectionMode}
        onChange={(_, toggleButtonLabel: string) => {
          if (toggleButtonLabel === ScanSelectionMode.Single) {
            setScanSelectionMode(ScanSelectionMode.Single);
          } else if (toggleButtonLabel === ScanSelectionMode.Multiple) {
            setScanSelectionMode(ScanSelectionMode.Multiple);
          }
        }}
      >
        <ToggleButton
          sx={{ textTransform: "none" }}
          value={ScanSelectionMode.Single}
        >
          {ScanSelectionMode.Single}
        </ToggleButton>
        <ToggleButton
          data-testid="multiple-scan-toggle"
          sx={{ textTransform: "none" }}
          value={ScanSelectionMode.Multiple}
        >
          {ScanSelectionMode.Multiple}
        </ToggleButton>
      </ToggleButtonGroup>
      {scanSelectionMode === ScanSelectionMode.Single ? (
        <SingleScanSelector />
      ) : (
        <MultiScanSelector />
      )}
    </Stack>
  );
};
