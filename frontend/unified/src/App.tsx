import { useState } from "react";
import { ApolloProvider } from "@apollo/client/react";

import { Box, Drawer, Typography } from "@mui/material";

import WorkflowsDataFetcher from "./components/WorkflowsDataFetcher/WorkflowsDataFetcher";

import { AppState, Beamline } from "./types";
import { apolloClientWorkflows } from "../../src/ApolloClient";
import { Progress } from "@diamondlightsource/sci-react-ui";
import { Sidebar } from "./components/Sidebar";
import { useOutletContextTyped } from "../../src/Layout";

const VERTICAL_SPACING = 2;
const HORIZONTAL_SPACING = 2;

export const App: React.FC = () => {
  const [selectedScanIds, setSelectedScanIds] = useState<number[]>([]);
  const outletCtx = useOutletContextTyped();

  const mapStringsToBeamline = (beamline: string): Beamline => {
    switch (beamline) {
      case "DIAD":
        return Beamline.DIAD;
      case "I08-1":
        return Beamline["I08-1"];
      case "I12":
        return Beamline.I12;
      case "I13-1":
        return Beamline["I13-1"];
      case "I13-2":
        return Beamline["I13-2"];
      case "I14":
        return Beamline.I14;
      case "E02":
        return Beamline.E02;
      case "E01":
        return Beamline.E01;
      default:
        console.error(`Unrecognised beamline: ${beamline}`);
    }
  };

  const { sessionVal } = outletCtx.session;
  const { appStateVal } = outletCtx.appState;

  if (appStateVal == AppState.VALID && sessionVal != null) {
    const sessionName = `${sessionVal.proposal.proposalCategory?.toLowerCase()}${sessionVal.proposal.proposalNumber}-${sessionVal.instrumentSessionNumber}`;

    // TODO: using `toLowerCase()` as the ULIMS instrument session service returns
    // a capitalised "proposal code", whereas the workflows service only accepts
    // it in lowercase
    const selectedVisit = {
      proposalCode: sessionVal?.proposal.proposalCategory.toLowerCase(),
      proposalNumber: sessionVal?.proposal.proposalNumber,
      number: sessionVal?.instrumentSessionNumber,
    };

    const beamline = mapStringsToBeamline(sessionVal.instrument.name);

    return (
      <>
        <Drawer variant="permanent">
          <Sidebar
            scanIds={selectedScanIds}
            updateSelectedScanIds={setSelectedScanIds}
          />
        </Drawer>

        <ApolloProvider client={apolloClientWorkflows}>
          <WorkflowsDataFetcher
            visit={selectedVisit}
            beamline={beamline}
            startTime={sessionVal.startTime}
            scanIds={selectedScanIds}
          />
        </ApolloProvider>
      </>
    );
  } else if (appStateVal == AppState.LOADING) {
    return (
      <Box sx={{ p: VERTICAL_SPACING }}>
        <Progress />
      </Box>
    );
  } else if (appStateVal == AppState.LATEST_NOT_FOUND) {
    return (
      <Box sx={{ p: VERTICAL_SPACING }}>
        <Typography variant="body1">
          Latest session not found. Please enter a session reference above (e.g.
          ab12345-1).
        </Typography>
      </Box>
    );
  } else if (appStateVal == AppState.FAILED_REGEX) {
    return (
      <Box sx={{ p: VERTICAL_SPACING }}>
        <Typography variant="body1">
          Session must be of the following format: ab12345-1
        </Typography>
      </Box>
    );
  } else {
    return (
      <Box sx={{ p: VERTICAL_SPACING }}>
        <Typography variant="body1">
          Invalid session. Please enter a session reference above (e.g.
          ab12345-1).
        </Typography>
      </Box>
    );
  }
};
