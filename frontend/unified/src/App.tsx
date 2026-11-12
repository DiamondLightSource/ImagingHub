import { useState, Suspense, useEffect } from "react";
import { ApolloProvider } from "@apollo/client/react";

import { Box, Drawer, IconButton, Stack, Tooltip } from "@mui/material";
import { ChevronsLeft, List, Table } from "lucide-react";

import WorkflowsDataFetcher from "./components/WorkflowsDataFetcher/WorkflowsDataFetcher";

import {
  Beamline,
  WorkflowsViewMode,
  InstrumentSession,
  SelectedScans,
} from "./types";
import {
  apolloClientWorkflows,
  apolloClientUlimsScans,
} from "../../src/ApolloClient";
import ProcessingView from "./components/ProcessingView/ProcessingView";
import { useResizableWidth } from "./hooks/useResizableWidth";
import { Sidebar } from "./components/Sidebar";

const PARAM_CONFIG_DRAWER_WIDTH = 600;

type AppProps = {
  session: InstrumentSession;
};

export const App: React.FC<AppProps> = ({ session }: AppProps) => {
  const [selectedScanIds, setSelectedScanIds] = useState<SelectedScans>({
    scans: [],
  });

  const sidebar = useResizableWidth(440, 340, 720);

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
    setSelectedScanIds({ scans: [] });
  }, [sessionRef]);

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box
        ref={sidebar.containerRef}
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          minHeight: 0,
          overflow: { xs: "auto", md: "hidden" },
        }}
      >
        <ApolloProvider client={apolloClientUlimsScans}>
          <Box
            sx={{
              position: "relative",
              width: { xs: "100%", md: sidebar.width },
              flex: { xs: "0 0 auto", md: `0 0 ${sidebar.width}px` },
              maxHeight: { xs: "45vh", md: "none" },
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
              borderStyle: "solid",
              borderWidth: { xs: "0 0 1px 0", md: "0 1px 0 0" },
              borderColor: "border.subtle",
              backgroundColor: "background.paper",
            }}
          >
            <Sidebar
              sessionRef={sessionRef}
              setSelectedScans={setSelectedScanIds}
              selectedScans={selectedScanIds}
            />

            {/*
              From: https://github.com/DiamondLightSource/xrpddatavis
              Resize handle - drag or focus + arrow keys; hidden on narrow layouts via CSS below
            */}
            <Box
              role="separator"
              aria-orientation="vertical"
              aria-label="Resize the plot list"
              aria-valuemin={340}
              aria-valuemax={720}
              aria-valuenow={Math.round(sidebar.width)}
              tabIndex={0}
              onPointerDown={sidebar.onPointerDown}
              onPointerMove={sidebar.onPointerMove}
              onPointerUp={sidebar.onPointerUp}
              onKeyDown={sidebar.onKeyDown}
              sx={{
                display: { xs: "none", md: "block" },
                position: "absolute",
                top: 0,
                bottom: 0,
                right: -4,
                width: 8,
                cursor: "col-resize",
                touchAction: "none",
                zIndex: 3,
                "&:hover::after, &:focus-visible::after": {
                  backgroundColor: "primary.main",
                },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: 3,
                  width: 2,
                  backgroundColor: sidebar.dragging
                    ? "primary.main"
                    : "transparent",
                },
              }}
            />
          </Box>
        </ApolloProvider>

        <Box
          sx={{
            flex: { xs: "0 0 60vh", md: 1 },
            height: { xs: "60vh", md: "auto" },
            minHeight: 0,
            display: "flex",
          }}
        >
          <Drawer
            variant="temporary"
            anchor="right"
            open={showParamConfigDrawer}
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
                    scanIds={selectedScanIds.scans.map((x) => {
                      console.log(x);
                      return x.scanNumber;
                    })}
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
      </Box>
    </Box>
  );
};
