import { Suspense, useState } from "react";
import { ApolloProvider } from "@apollo/client/react";

import {
  Alert,
  Box,
  Drawer,
  IconButton,
  SwipeableDrawer,
  Tooltip,
} from "@mui/material";
import { ChevronsLeft } from "lucide-react";

import WorkflowsDataFetcher from "./components/WorkflowsDataFetcher/WorkflowsDataFetcher";

import { AppState, Beamline } from "./types";
import { apolloClientWorkflows } from "../../src/ApolloClient";
import { Navbar, Progress } from "@diamondlightsource/sci-react-ui";
import { Sidebar } from "./components/Sidebar";
import { useOutletContextTyped } from "../../src/Layout";
import ProcessingView from "./components/ProcessingView/ProcessingView";

const VERTICAL_SPACING = 2;
const SIDEBAR_WIDTH = 300;

export const App: React.FC = () => {
  const [selectedScanIds, setSelectedScanIds] = useState<number[]>([]);
  const [showParamConfigDrawer, setShowParamConfigDrawer] =
    useState<boolean>(false);
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
  const { appStatusVal } = outletCtx.appStatus;

  if (appStatusVal.state === AppState.VALID && sessionVal !== null) {
    // TODO: using `toLowerCase()` as the ULIMS instrument session service returns
    // a capitalised "proposal code", whereas the workflows service only accepts
    // it in lowercase
    const selectedVisit = {
      proposalCode: sessionVal?.proposal.proposalCategory?.toLowerCase(),
      proposalNumber: sessionVal?.proposal.proposalNumber,
      number: sessionVal?.instrumentSessionNumber,
    };

    const beamline = mapStringsToBeamline(sessionVal.instrument.name);

    return (
      <Box sx={{ display: "flex" }}>
        <Drawer
          variant="permanent"
          sx={{
            width: SIDEBAR_WIDTH,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: SIDEBAR_WIDTH,
              boxSizing: "border-box",
            },
          }}
        >
          <Sidebar
            scanIds={selectedScanIds}
            updateSelectedScanIds={setSelectedScanIds}
          />
        </Drawer>
        <SwipeableDrawer
          variant="temporary"
          anchor="right"
          open={showParamConfigDrawer}
          onOpen={() => setShowParamConfigDrawer(true)}
          onClose={() => setShowParamConfigDrawer(false)}
        >
          <Box padding={2}>
            <Navbar visibility="hidden" />
            <Suspense>
              <ApolloProvider client={apolloClientWorkflows}>
                <ProcessingView
                  visit={selectedVisit}
                  beamline={beamline}
                  startTime={sessionVal.startTime}
                  scanIds={selectedScanIds}
                />
              </ApolloProvider>
            </Suspense>
          </Box>
        </SwipeableDrawer>
        <Box sx={{ flexGrow: 1 }}>
          <ApolloProvider client={apolloClientWorkflows}>
            <WorkflowsDataFetcher visit={selectedVisit} />
          </ApolloProvider>
        </Box>
        <Box
          sx={{
            marginLeft: 1,
          }}
        >
          <Tooltip title="Open parameter configuration">
            <IconButton onClick={() => setShowParamConfigDrawer(true)}>
              <ChevronsLeft />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    );
  } else if (appStatusVal.state === AppState.LOADING) {
    return (
      <Box sx={{ p: VERTICAL_SPACING }}>
        <Progress />
      </Box>
    );
  } else if (appStatusVal.state === AppState.LATEST_NOT_FOUND) {
    return (
      <Box sx={{ p: VERTICAL_SPACING }}>
        <Alert severity="info" variant="standard">
          Latest session not found. Please enter a session reference above (e.g.
          ab12345-1).
        </Alert>
      </Box>
    );
  } else if (appStatusVal.state === AppState.FAILED_REGEX) {
    return (
      <Box sx={{ p: VERTICAL_SPACING }}>
        <Alert severity="info" variant="standard">
          Session must be of the following format: ab12345-1
        </Alert>
      </Box>
    );
  } else if (appStatusVal.state === AppState.INVALID_SESSION) {
    return (
      <Box sx={{ p: VERTICAL_SPACING }}>
        <Alert severity="warning" variant="standard">
          {appStatusVal.message}
        </Alert>
      </Box>
    );
  } else {
    // Handle the AppState.ERROR case
    return (
      <Box sx={{ p: VERTICAL_SPACING }}>
        <Alert severity="error" variant="standard">
          {appStatusVal.message}
        </Alert>
      </Box>
    );
  }
};
