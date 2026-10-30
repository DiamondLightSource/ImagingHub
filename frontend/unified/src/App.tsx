import { useState, Suspense, useEffect } from "react";
import { ApolloProvider } from "@apollo/client/react";

import { Box, Drawer, IconButton, Stack, Tooltip } from "@mui/material";
import { ChevronsLeft, List, Table } from "lucide-react";

import WorkflowsDataFetcher from "./components/WorkflowsDataFetcher/WorkflowsDataFetcher";

import {
  Beamline,
  WorkflowsViewMode,
  InstrumentSession,
  ScanNodeProcessed,
} from "./types";
import {
  apolloClientWorkflows,
  apolloClientUlimsScans,
} from "../../src/ApolloClient";
import { Sidebar } from "./components/Sidebar";
import ProcessingView from "./components/ProcessingView/ProcessingView";

const SIDEBAR_WIDTH = 300;
const PARAM_CONFIG_DRAWER_WIDTH = 600;

type AppProps = {
  session: InstrumentSession;
};

export const App: React.FC<AppProps> = ({ session }: AppProps) => {
  const [selectedScanIds, setSelectedScanIds] = useState<ScanNodeProcessed[]>(
    []
  );

  const [showParamConfigDrawer, setShowParamConfigDrawer] =
    useState<boolean>(false);
  const [workflowsViewMode, setWorkflowsViewMode] = useState<WorkflowsViewMode>(
    WorkflowsViewMode.List
  );

  // TODO: using `toLowerCase()` as the ULIMS instrument session service returns
  // a capitalised "proposal code", whereas the workflows service only accepts
  // it in lowercase
  const selectedVisit = {
    proposalCode: session?.proposal?.proposalCategory?.toLowerCase() ?? "",
    proposalNumber: session.proposal?.proposalNumber ?? NaN,
    number: session.instrumentSessionNumber,
  };

  const sessionRef = `${selectedVisit.proposalCode}${selectedVisit.proposalNumber}-${selectedVisit.number}`;

  const beamline = Beamline[session.instrument.name as keyof typeof Beamline];

  // Clear selected scan IDs when session changes
  useEffect(() => {
    setSelectedScanIds([]);
  }, [sessionRef]);

  return (
    <Box sx={{ display: "flex", height: "100%" }}>
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
        <ApolloProvider client={apolloClientUlimsScans}>
          <Sidebar
            sessionRef={sessionRef}
            scanData={selectedScanIds}
            updateScanData={setSelectedScanIds}
          />
        </ApolloProvider>
      </Drawer>
      <Drawer
        variant="temporary"
        anchor="right"
        open={showParamConfigDrawer}
        onOpen={() => setShowParamConfigDrawer(true)}
        onClose={() => setShowParamConfigDrawer(false)}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 2 }}
        ModalProps={{ keepMounted: true }}
      >
        <Box padding={2} width={PARAM_CONFIG_DRAWER_WIDTH}>
          <Suspense>
            <ApolloProvider client={apolloClientWorkflows}>
              <ProcessingView
                visit={selectedVisit}
                beamline={beamline}
                startTime={session.startTime}
                scanIds={selectedScanIds.map((x) => x.scanNumber)}
              />
            </ApolloProvider>
          </Suspense>
        </Box>
      </Drawer>
      <Box sx={{ flexGrow: 1, overflow: "auto" }}>
        <ApolloProvider client={apolloClientWorkflows}>
          <WorkflowsDataFetcher
            visit={selectedVisit}
            workflowsViewMode={workflowsViewMode}
            scanData={selectedScanIds}
          />
        </ApolloProvider>
      </Box>
      <Box
        sx={{
          marginLeft: 1,
        }}
      >
        <Stack direction="column">
          <Tooltip title="Open parameter configuration">
            <IconButton onClick={() => setShowParamConfigDrawer(true)}>
              <ChevronsLeft />
            </IconButton>
          </Tooltip>
          <Tooltip
            title={
              workflowsViewMode === WorkflowsViewMode.List
                ? "Table view"
                : "List view"
            }
          >
            <IconButton
              onClick={() =>
                workflowsViewMode === WorkflowsViewMode.List
                  ? setWorkflowsViewMode(WorkflowsViewMode.Table)
                  : setWorkflowsViewMode(WorkflowsViewMode.List)
              }
            >
              {workflowsViewMode === WorkflowsViewMode.List ? (
                <Table />
              ) : (
                <List />
              )}
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    </Box>
  );
};
