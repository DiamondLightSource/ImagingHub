import { gql, TypedDocumentNode } from "@apollo/client";
import {
  SessionQueryQuery,
  SessionQueryQueryVariables,
} from "./__generated__/SessionManager.generated";
import { useQuery } from "@apollo/client/react";
import { Chip, Stack, Typography } from "@mui/material";
import SessionSelector from "./SessionSelector";
import { Visit, visitToText } from "@diamondlightsource/sci-react-ui";
import { InstrumentSession } from "../../types";

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
              startTime
            }
          }
        }
      }
    }
  }
`;

const SessionManager = ({
  session,
  setSession,
}: {
  session: InstrumentSession | null;
  setSession: (_: InstrumentSession | null) => void;
}) => {
  const { loading, error, data } = useQuery(SESSION_QUERY, { variables: {} });

  if (error) return <p>Error: {error.message}</p>;
  if (loading) return <p>Loading...</p>;
  if (!data) return <p>Data undefined</p>;
  if (!data.account) return <p>Account null</p>;

  const latestSession =
    data.account.instrumentSessionRoles.edges[0].node.instrumentSession;

  return (
    <>
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography variant="h5">Session</Typography>
        <Chip
          color="primary"
          variant="outlined"
          label={
            session
              ? visitToText({
                  proposalCode:
                    session.proposal.proposalCategory?.toLowerCase(),
                  proposalNumber: session.proposal.proposalNumber,
                  number: session.instrumentSessionNumber,
                } as Visit)
              : "No Visit"
          }
        />
        <Chip
          color="secondary"
          variant="outlined"
          label={session ? session.instrument.name : "No Beamline"}
        />
      </Stack>
      <SessionSelector
        latestSession={latestSession}
        session={session}
        setSession={setSession}
      />
    </>
  );
};

export default SessionManager;
