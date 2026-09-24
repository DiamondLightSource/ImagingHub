import { Divider, Stack } from "@mui/material";
import JobsViewer from "./components/JobsViewer/JobsViewer";

import { useState } from "react";
import { Beamline } from "./types";
import { ApolloProvider } from "@apollo/client/react";
import {
  apolloClientUlims,
  apolloClientWorkflows,
} from "../../src/ApolloClient";
import { Visit } from "@diamondlightsource/sci-react-ui";
import SessionManager from "./components/SessionManager/SessionManager";
import JobsSubmitter from "./components/JobsSubmitter/JobsSubmitter";

const VERTICAL_SPACING = 2;
const HORIZONTAL_SPACING = 2;

export const App: React.FC = () => {
  const [beamline, setBeamline] = useState<Beamline | null>(null);
  const [visit, setVisit] = useState<Visit | null>(null);

  return (
    <ApolloProvider client={apolloClientWorkflows}>
      <Stack direction="row" spacing={HORIZONTAL_SPACING}>
        <Stack direction="column" spacing={VERTICAL_SPACING} width="500px">
          <ApolloProvider client={apolloClientUlims}>
            <SessionManager
              beamline={beamline}
              setBeamline={setBeamline}
              visit={visit}
              setVisit={setVisit}
            />
          </ApolloProvider>
          {visit && beamline && (
            <JobsSubmitter
              beamline={beamline}
              visit={visit}
              verticalSpacing={VERTICAL_SPACING}
            />
          )}
        </Stack>
        <Divider orientation="vertical" flexItem />
        <JobsViewer visit={visit} verticalSpacing={VERTICAL_SPACING} />
      </Stack>
    </ApolloProvider>
  );
};
