import {
  Chip,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
} from "@mui/material";
import { useState } from "react";
import { gql, type TypedDocumentNode } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import {
  SessionQueryQuery,
  SessionQueryQueryVariables,
} from "./__generated__/SessionSelector.generated";

const SESSION_QUERY: TypedDocumentNode<
  SessionQueryQuery,
  SessionQueryQueryVariables
> = gql`
  query sessionQuery {
    account(username: "twi18192") {
      proposalRoles {
        proposal {
          proposalNumber
          proposalCategory
          title
          instrumentSessions {
            startTime
            endTime
            instrumentSessionNumber
          }
        }
      }
    }
  }
`;

enum SessionSelectionMode {
  Latest = "Latest",
  Custom = "Custom",
}

export const SessionSelector: React.FC = () => {
  // TODO: initial value based on fetching latest session associated with logged-in user
  const [session] = useState<string>("latest-session");
  // TODO: initial value based on the initial session
  const [beamline] = useState<string>("Beamline: depends-on-session");
  const [sessionSelectionMode, setSessionSelectionMode] =
    useState<SessionSelectionMode>(SessionSelectionMode.Latest);
  const [textInputValue, setTextInputValue] = useState<string>("");
  const sessions = useQuery(SESSION_QUERY, {});
  console.log("sessions: ", sessions);

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
        variant="outlined"
        label="Session"
        disabled={sessionSelectionMode === SessionSelectionMode.Latest}
        value={
          sessionSelectionMode === SessionSelectionMode.Latest
            ? session
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
