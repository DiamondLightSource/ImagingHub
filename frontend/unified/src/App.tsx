import { useState } from "react";
import { ApolloProvider, useQuery } from "@apollo/client/react";

import { Box, Chip, Drawer, Grid, Stack, Typography } from "@mui/material";

import {
  InstrumentSession,
  SessionSelectionMode,
  SessionSelector,
} from "./components/SessionSelector";
import WorkflowsDataFetcher from "./components/WorkflowsDataFetcher/WorkflowsDataFetcher";

import { Beamline } from "./types";
import { apolloClientWorkflows } from "../../src/ApolloClient";
import { useAuth } from "@diamondlightsource/sci-react-ui";
import { Sidebar } from "./components/Sidebar";
import { SESSION_QUERY } from "./graphql/SessionQuery";
import { useOutletContextTyped } from "../../src/Layout";

const VERTICAL_SPACING = 2;
const HORIZONTAL_SPACING = 2;

const useFedid = (): string => {
  const token = useAuth().getToken();
  const parseToken = JSON.parse(atob(token.split(".")[1]));
  return parseToken.fedid;
};

export const App: React.FC = () => {
  // const [sessionSelectionMode, setSessionSelectionMode] =
  //   useState<SessionSelectionMode>(SessionSelectionMode.Latest);
  const [selectedScanIds, setSelectedScanIds] = useState<number[]>([]);
  const { loading, error, data } = useQuery(SESSION_QUERY, {
    variables: { username: useFedid() },
    // variables: { username: "twi18192" },
  });

  const outletCtx = useOutletContextTyped();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;
  if (data === undefined) {
    return <p>Data undefined</p>;
  }
  if (data.account === null) {
    return <p>Account null</p>;
  }

  /**
   * Determine the current session based on which session-selection mode is enabled.
   *
   * Note: if the session-selection mode is "latest", then the current session will only be
   * updated to the `customSession` state if the session input string both matches the visit
   * regex and the string corresponds to an actual visit (when both conditions are fulfilled,
   * the `customSession` state is not `null`).
   */
  const determineCurrentSession = (
    mode: SessionSelectionMode,
    latestSession: InstrumentSession,
    customSession: InstrumentSession | null
  ): InstrumentSession => {
    if (mode === SessionSelectionMode.Latest) {
      return latestSession;
    } else if (mode === SessionSelectionMode.Custom && customSession !== null) {
      return customSession;
    } else {
      // The only other possible case is:
      // ```
      // mode === SessionSelectionMode.Custom && customSession === null
      // ```
      // and in this case the latest visit is selected.
      //
      // Used an else rather than else-if so then TypeScript knows that all cases have been
      // exhausted and won't say that `session` or `sessionName` may be undefined.
      return latestSession;
    }
  };

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

  // const getSessionSelector = (
  //   latestEnabled: boolean = true,
  //   session: InstrumentSession | null,
  //   sessionName: string | null
  // ) => {
  //   return (
  //     <Box justifyItems="center">
  //       <Stack direction="row" spacing={2} alignItems="center" marginBottom={2}>
  //         <Typography variant="h5">Session</Typography>

  //         {/* Show chips only when session & sessionName are defined */}
  //         {session && sessionName ? (
  //           <>
  //             <Chip color="primary" variant="outlined" label={sessionName} />
  //             <Chip
  //               color="secondary"
  //               variant="outlined"
  //               label={session.instrument.name}
  //             />
  //           </>
  //         ) : (
  //           <></>
  //         )}
  //       </Stack>
  //       <SessionSelector
  //         setSession={setCustomSession}
  //         mode={
  //           latestEnabled ? sessionSelectionMode : SessionSelectionMode.Custom
  //         }
  //         setMode={setSessionSelectionMode}
  //         latestEnabled={latestEnabled}
  //       />
  //     </Box>
  //   );
  // };

  const latestSessionAvailable =
    data.account.instrumentSessionRoles.edges.length > 0;

  // Case 1: No latest, no custom
  // Case 2: No latest, custom
  // Case 3: Latest

  const customSession = outletCtx.session.selectedSession;

  if (customSession != null || latestSessionAvailable) {
    let session = customSession;

    if (customSession == null) {
      session =
        data.account.instrumentSessionRoles.edges[0].node.instrumentSession;
    } else {
      session = customSession;
    }

    // Get latest session, if available and latest session mode is selected
    // if (latestSessionAvailable) {
    //   session = determineCurrentSession(
    //     sessionSelectionMode,
    //     data.account.instrumentSessionRoles.edges[0].node.instrumentSession,
    //     customSession
    //   );
    // } else {
    //   session = customSession;
    // }

    if (session == null) {
      return;
    }

    const sessionName = `${session.proposal.proposalCategory?.toLowerCase()}${session.proposal.proposalNumber}-${session.instrumentSessionNumber}`;

    // TODO: using `toLowerCase()` as the ULIMS instrument session service returns
    // a capitalised "proposal code", whereas the workflows service only accepts
    // it in lowercase
    const selectedVisit = {
      proposalCode: session?.proposal.proposalCategory.toLowerCase(),
      proposalNumber: session?.proposal.proposalNumber,
      number: session?.instrumentSessionNumber,
    };

    const beamline = mapStringsToBeamline(session.instrument.name);

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
            startTime={session.startTime}
            scanIds={selectedScanIds}
          />
        </ApolloProvider>
      </>
    );
  } else {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body1">
          Session not found. Please enter a session reference above (e.g.
          ab12345-1).
        </Typography>
      </Box>
    );
  }
};
