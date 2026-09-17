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

type SingleScanSelectorProps = {
  scanId: number;
  setScanId: (_: number) => void;
};

const SingleScanSelector: React.FC<SingleScanSelectorProps> = ({
  scanId,
  setScanId,
}: SingleScanSelectorProps) => {
  return (
    <Stack>
      <TextField
        label="Scan number"
        value={scanId}
        type="number"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setScanId(Number(e.currentTarget.value));
        }}
      />
    </Stack>
  );
};

const MultiScanSelector: React.FC<ScanSelectorProps> = ({
  scanIds,
  setScanIds,
}) => {
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
        <MultiScanManualSelector scanIds={scanIds} setScanIds={setScanIds} />
      ) : (
        <MultiScanRangeSelector />
      )}
    </>
  );
};

const MultiScanRangeSelector: React.FC = () => {
  const [start, setStart] = useState<number>(1);
  const [stop, setStop] = useState<number>(2);
  const [step, setStep] = useState<number>(1);

  return (
    <Stack direction="row" spacing={2}>
      <TextField
        label="Start"
        type="number"
        value={start}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setStart(Number(e.target.value))
        }
      />
      <TextField
        label="Stop"
        type="number"
        value={stop}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setStop(Number(e.target.value))
        }
      />
      <TextField
        label="Step"
        type="number"
        value={step}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setStep(Number(e.target.value))
        }
      />
    </Stack>
  );
};

const MultiScanManualSelector: React.FC<ScanSelectorProps> = ({
  scanIds,
  setScanIds,
}) => {
  const [textInputValue, setTextInputValue] = useState<string>("4");

  const handleDeleteScanIdChip = (idToDelete: number) => {
    setScanIds(scanIds.filter((id) => id !== idToDelete));
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

type ScanSelectorProps = {
  scanIds: number[];
  setScanIds: (_: number[]) => void;
};

export const ScanSelector: React.FC<ScanSelectorProps> = ({
  scanIds,
  setScanIds,
}: ScanSelectorProps) => {
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
        <SingleScanSelector
          scanId={scanIds[0]}
          setScanId={(scanId) => setScanIds([scanId])}
        />
      ) : (
        <MultiScanSelector scanIds={scanIds} setScanIds={setScanIds} />
      )}
    </Stack>
  );
};
