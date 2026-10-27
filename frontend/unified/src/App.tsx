import { Suspense, useState } from "react";
import { ApolloProvider } from "@apollo/client/react";

import { Alert, Box, Drawer, IconButton, Stack, Tooltip } from "@mui/material";
import { ChevronsLeft, List, Table } from "lucide-react";

import WorkflowsDataFetcher from "./components/WorkflowsDataFetcher/WorkflowsDataFetcher";

import { AppState, Beamline, WorkflowsViewMode } from "./types";
import { apolloClientWorkflows } from "../../src/ApolloClient";
import { Progress } from "@diamondlightsource/sci-react-ui";
import { Sidebar } from "./components/Sidebar";
import { useOutletContextTyped } from "../../src/Layout";
import ProcessingView from "./components/ProcessingView/ProcessingView";

const VERTICAL_SPACING = 2;
const SIDEBAR_WIDTH = 300;
const PARAM_CONFIG_DRAWER_WIDTH = 600;

export const App: React.FC = () => {
  const [selectedScanIds, setSelectedScanIds] = useState<number[]>([]);
  const [showParamConfigDrawer, setShowParamConfigDrawer] =
    useState<boolean>(false);
  const [workflowsViewMode, setWorkflowsViewMode] = useState<WorkflowsViewMode>(
    WorkflowsViewMode.List
  );
  const outletCtx = useOutletContextTyped();

  const { sessionVal } = outletCtx.session;
  const { appStatusVal } = outletCtx.appStatus;

  if (appStatusVal.state === AppState.VALID && sessionVal !== null) {
    // TODO: using `toLowerCase()` as the ULIMS instrument session service returns
    // a capitalised "proposal code", whereas the workflows service only accepts
    // it in lowercase
    const selectedVisit = {
      proposalCode: sessionVal?.proposal.proposalCategory?.toLowerCase() ?? "",
      proposalNumber: sessionVal?.proposal.proposalNumber,
      number: sessionVal?.instrumentSessionNumber,
    };

    const beamline =
      Beamline[sessionVal.instrument.name as keyof typeof Beamline];

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
        <Drawer
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
                  startTime={sessionVal.startTime}
                  scanIds={selectedScanIds}
                />
              </ApolloProvider>
            </Suspense>
          </Box>
        </Drawer>
        <Box sx={{ flexGrow: 1 }}>
          <ApolloProvider client={apolloClientWorkflows}>
            <WorkflowsDataFetcher
              visit={selectedVisit}
              workflowsViewMode={workflowsViewMode}
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
