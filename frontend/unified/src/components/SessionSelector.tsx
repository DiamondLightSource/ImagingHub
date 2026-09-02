import React from "react";
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

export const SESSION_QUERY: TypedDocumentNode<
  SessionQueryQuery,
  SessionQueryQueryVariables
> = gql`
  query sessionQuery {
    account(username: "twi18192") {
      instrumentSessionRoles(first: 1) {
        edges {
          node {
            instrumentSession {
              proposal {
                proposalNumber
                proposalCategory
              }
              instrumentSessionNumber
            }
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
  // TODO: initial value based on the initial session
  const [beamline] = useState<string>("Beamline: depends-on-session");
  const [sessionSelectionMode, setSessionSelectionMode] =
    useState<SessionSelectionMode>(SessionSelectionMode.Latest);
  const [textInputValue, setTextInputValue] = useState<string>("");
  const { loading, error, data } = useQuery(SESSION_QUERY, { variables: {} });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;
  if (data === undefined) {
    return <p>Data undefined</p>;
  }

  const instrumentSession =
    data.account?.instrumentSessionRoles.edges[0].node.instrumentSession;
  const proposal = instrumentSession?.proposal;
  const latestSession = `${proposal?.proposalCategory?.toLowerCase()}${proposal?.proposalNumber}-${instrumentSession?.instrumentSessionNumber}`;

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
