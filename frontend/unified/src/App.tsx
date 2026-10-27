import { useState, Suspense } from "react";
import { ApolloProvider } from "@apollo/client/react";

import {
  Box,
  Drawer,
  IconButton,
  SwipeableDrawer,
  Tooltip,
} from "@mui/material";

import { ChevronsLeft } from "lucide-react";

import WorkflowsDataFetcher from "./components/WorkflowsDataFetcher/WorkflowsDataFetcher";

import { Beamline, InstrumentSession } from "./types";
import { apolloClientWorkflows } from "../../src/ApolloClient";
import { Sidebar } from "./components/Sidebar";
import ProcessingView from "./components/ProcessingView/ProcessingView";

const SIDEBAR_WIDTH = 300;
const PARAM_CONFIG_DRAWER_WIDTH = 600;

type AppProps = {
  session: InstrumentSession;
};

export const App: React.FC<AppProps> = ({ session }: AppProps) => {
  const [selectedScanIds, setSelectedScanIds] = useState<number[]>([]);
  const [showParamConfigDrawer, setShowParamConfigDrawer] =
    useState<boolean>(false);

  // TODO: using `toLowerCase()` as the ULIMS instrument session service returns
  // a capitalised "proposal code", whereas the workflows service only accepts
  // it in lowercase
  const selectedVisit = {
    proposalCode: session.proposal.proposalCategory?.toLowerCase() ?? "",
    proposalNumber: session.proposal.proposalNumber,
    number: session.instrumentSessionNumber,
  };

  const beamline = Beamline[session.instrument.name as keyof typeof Beamline];

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
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 2 }}
      >
        <Box padding={2} width={PARAM_CONFIG_DRAWER_WIDTH}>
          <Suspense>
            <ApolloProvider client={apolloClientWorkflows}>
              <ProcessingView
                visit={selectedVisit}
                beamline={beamline}
                startTime={session.startTime}
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
};
