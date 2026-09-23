import { gql, TypedDocumentNode } from "@apollo/client";
import {
  SessionQueryQuery,
  SessionQueryQueryVariables,
} from "./__generated__/SessionManager.generated";
import { useQuery } from "@apollo/client/react";
import { Chip, Stack, Typography } from "@mui/material";
import { InstrumentSession, SessionSelector } from "./SessionSelector";
import { useState } from "react";
import { determineCurrentSession, mapStringsToBeamline } from "./utils";
import { Beamline, SessionSelectionMode } from "../../types";
import { Visit, visitToText } from "@diamondlightsource/sci-react-ui";

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
              instrument {
                name
              }
            }
          }
        }
      }
    }
  }
`;

const SessionManager = ({
  setBeamline,
}: {
  setBeamline: (beamline: Beamline | null) => void;
}) => {
  const [sessionSelectionMode, setSessionSelectionMode] =
    useState<SessionSelectionMode>(SessionSelectionMode.Latest);
  const [customSession, setCustomSession] = useState<InstrumentSession | null>(
    null
  );
  const { loading, error, data } = useQuery(SESSION_QUERY, { variables: {} });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>Data undefined</p>;
  if (!data.account) return <p>Account null</p>;

  const session = determineCurrentSession(
    sessionSelectionMode,
    data.account.instrumentSessionRoles.edges[0].node.instrumentSession,
    customSession
  );
  const sessionName = visitToText({
    proposalCode: session.proposal.proposalCategory?.toLowerCase(),
    proposalNumber: session.proposal.proposalNumber,
    number: session.instrumentSessionNumber,
  } as Visit);

  setBeamline(mapStringsToBeamline(session.instrument.name));

  return (
    <>
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography variant="h5">Session</Typography>
        <Chip color="primary" variant="outlined" label={sessionName} />
        <Chip
          color="secondary"
          variant="outlined"
          label={session.instrument.name}
        />
      </Stack>
      <SessionSelector
        setSession={setCustomSession}
        mode={sessionSelectionMode}
        setMode={setSessionSelectionMode}
      />
    </>
  );
};

export default SessionManager;
