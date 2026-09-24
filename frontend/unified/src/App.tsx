import { Divider, Stack } from "@mui/material";
import JobsViewer from "./components/JobsViewer/JobsViewer";

import { useState } from "react";
import { ApolloProvider } from "@apollo/client/react";
import {
  apolloClientUlims,
  apolloClientWorkflows,
} from "../../src/ApolloClient";
import { Visit } from "@diamondlightsource/sci-react-ui";
import SessionManager from "./components/SessionManager/SessionManager";
import JobsSubmitter from "./components/JobsSubmitter/JobsSubmitter";
import { InstrumentSession } from "./types";

const VERTICAL_SPACING = 2;
const HORIZONTAL_SPACING = 2;

export const App: React.FC = () => {
  const [session, setSession] = useState<InstrumentSession | null>(null);

  return (
    <ApolloProvider client={apolloClientWorkflows}>
      <Stack direction="row" spacing={HORIZONTAL_SPACING}>
        <Stack direction="column" spacing={VERTICAL_SPACING} width="500px">
          <ApolloProvider client={apolloClientUlims}>
            <SessionManager session={session} setSession={setSession} />
          </ApolloProvider>
          {session && (
            <JobsSubmitter
              session={session}
              verticalSpacing={VERTICAL_SPACING}
            />
          )}
        </Stack>
        <Divider orientation="vertical" flexItem />
        <JobsViewer
          visit={
            {
              proposalCode: session?.proposal.proposalCategory?.toLowerCase(),
              proposalNumber: session?.proposal.proposalNumber,
              number: session?.instrumentSessionNumber,
            } as Visit
          }
          verticalSpacing={VERTICAL_SPACING}
        />
      </Stack>
    </ApolloProvider>
  );
};
