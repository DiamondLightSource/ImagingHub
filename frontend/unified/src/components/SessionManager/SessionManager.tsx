import { gql, TypedDocumentNode } from "@apollo/client";
import {
  SessionQueryQuery,
  SessionQueryQueryVariables,
} from "./__generated__/SessionManager.generated";
import { useQuery } from "@apollo/client/react";
import { Chip, Stack, Typography } from "@mui/material";
import SessionSelector from "./SessionSelector";
import { Beamline } from "../../types";
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
  beamline,
  setBeamline,
  visit,
  setVisit,
}: {
  beamline: Beamline | null;
  setBeamline: (beamline: Beamline | null) => void;
  visit: Visit | null;
  setVisit: (visit: Visit | null) => void;
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
          label={visit ? visitToText(visit) : "No Visit"}
        />
        <Chip
          color="secondary"
          variant="outlined"
          label={beamline ? beamline : "No Beamline"}
        />
      </Stack>
      <SessionSelector
        latestSession={latestSession}
        beamline={beamline}
        setBeamline={setBeamline}
        visit={visit}
        setVisit={setVisit}
      />
    </>
  );
};

export default SessionManager;
