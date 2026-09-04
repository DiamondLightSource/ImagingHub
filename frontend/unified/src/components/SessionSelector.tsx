import React from "react";
import {
  Chip,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
} from "@mui/material";
import { useState } from "react";
import { SessionQueryQuery } from "../__generated__/App.generated";

enum SessionSelectionMode {
  Latest = "Latest",
  Custom = "Custom",
}

type Proposal = {
  proposalNumber: number;
  proposalCategory: string;
};

type Instrument = {
  name: string;
};

export type InstrumentSession = {
  instrumentSessionNumber: number;
  proposal: Proposal;
  instrument: Instrument;
};

type SessionSelectorProps = {
  session: InstrumentSession;
};

export const SessionSelector: React.FC<SessionSelectorProps> = ({
  session,
}: SessionSelectorProps) => {
  const [beamline] = useState<string>(session.instrument.name);
  const [sessionSelectionMode, setSessionSelectionMode] =
    useState<SessionSelectionMode>(SessionSelectionMode.Latest);
  const [textInputValue, setTextInputValue] = useState<string>("");

  const proposal = session?.proposal;
  const latestSession = `${proposal?.proposalCategory?.toLowerCase()}${proposal?.proposalNumber}-${session?.instrumentSessionNumber}`;

  return (
    <Stack direction="row" spacing={2} alignItems={"center"}>
      <ToggleButtonGroup
        exclusive
        value={sessionSelectionMode}
        onChange={(_, toggleButtonLabel: string) => {
          if (toggleButtonLabel === SessionSelectionMode.Latest) {
            setSessionSelectionMode(SessionSelectionMode.Latest);
          } else if (toggleButtonLabel === SessionSelectionMode.Custom) {
            setSessionSelectionMode(SessionSelectionMode.Custom);
          }
        }}
      >
        <ToggleButton
          sx={{ textTransform: "none" }}
          value={SessionSelectionMode.Latest}
        >
          {SessionSelectionMode.Latest}
        </ToggleButton>
        <ToggleButton
          sx={{ textTransform: "none" }}
          value={SessionSelectionMode.Custom}
        >
          {SessionSelectionMode.Custom}
        </ToggleButton>
      </ToggleButtonGroup>
      <TextField
        data-testid="session-selector-input"
        variant="outlined"
        label="Session"
        disabled={sessionSelectionMode === SessionSelectionMode.Latest}
        value={
          sessionSelectionMode === SessionSelectionMode.Latest
            ? latestSession
            : textInputValue
        }
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setTextInputValue(e.currentTarget.value);
        }}
      />
      <Chip label={beamline} variant="outlined" color="primary"></Chip>
    </Stack>
  );
};
