import { useState } from "react";
import { gql, type TypedDocumentNode } from "@apollo/client";
import { ApolloProvider, useQuery } from "@apollo/client/react";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { ChevronDown } from "lucide-react";

import {
  InstrumentSession,
  SessionSelectionMode,
  SessionSelector,
} from "./components/SessionSelector";
import { ScanSelector } from "./components/ScanSelector";
import JobsViewer from "./components/JobsViewer/JobsViewer";

import { templateOptions } from "./data/templates";
import { WorkflowForm } from "./components/WorkflowForm";
import { Beamline, Technique } from "./types";
import { ParameterConfiguration } from "./components/ParameterConfiguration/ParameterConfiguration";
import { apolloClientWorkflows } from "../../src/ApolloClient";
import { useAuth } from "@diamondlightsource/sci-react-ui";
import {
  SessionQueryQuery,
  SessionQueryQueryVariables,
} from "./__generated__/App.generated";

const VERTICAL_SPACING = 2;
const HORIZONTAL_SPACING = 2;

const BEAMLINE_TECHNIQUES_SUBSET = {
  [Beamline.DIAD]: [Technique.Tomo],
  [Beamline.I12]: [Technique.Tomo],
  [Beamline["I08-1"]]: [Technique.Ptycho, Technique.Ptypy],
  [Beamline["I13-1"]]: [
    Technique.Dpc,
    Technique.Ptyrex,
    Technique.Tomo,
    Technique.Xanes,
    Technique.Xrd,
  ],
  [Beamline["I13-2"]]: [Technique.Ptycho, Technique.Tomo],
  [Beamline.I14]: [Technique.Dpc, Technique.Xanes, Technique.Xrd],
  [Beamline.E02]: [
    Technique.Dpc,
    Technique.Nbed,
    Technique.Ptyrex,
    Technique.Mib,
  ],
  [Beamline.E01]: [Technique.Dpc, Technique.Nbed, Technique.Ptyrex],
  [Beamline.P99]: [Technique.Ptypy],
};

const BEAMLINES_DEFAULT_TECHNIQUE = {
  [Beamline.DIAD]: Technique.Tomo,
  [Beamline.E02]: Technique.Mib,
  [Beamline.E01]: Technique.Ptyrex,
  [Beamline.I12]: Technique.Tomo,
  [Beamline["I08-1"]]: Technique.Ptycho,
  [Beamline["I13-1"]]: Technique.Ptycho,
  [Beamline["I13-2"]]: Technique.Ptycho,
  [Beamline.I14]: Technique.Dpc,
  [Beamline.P99]: Technique.Ptypy,
};

const filterTemplates = (technique: Technique) => {
  return templateOptions.filter((option) =>
    option.value.includes(technique.toLowerCase())
  );
};

export const SESSION_QUERY: TypedDocumentNode<
  SessionQueryQuery,
  SessionQueryQueryVariables
> = gql`
  query sessionQuery($username: String!) {
    account(username: $username) {
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
              startTime
            }
          }
        }
      }
    }
  }
`;

const useFedid = (): string => {
  const token = useAuth().getToken();
  const parseToken = JSON.parse(atob(token.split(".")[1]));
  return parseToken.fedid;
};

export const App: React.FC = () => {
  //adding common states of beamlines, Techique, workflow
  const [showAllTechniques, setShowAllTechniques] = useState(false);
  const [technique, setTechnique] = useState<Technique | null>(null);
  const [template, setTemplate] = useState<string | null>(null);
  const [sessionSelectionMode, setSessionSelectionMode] =
    useState<SessionSelectionMode>(SessionSelectionMode.Latest);
  const [customSession, setCustomSession] = useState<InstrumentSession | null>(
    null
  );
  const [selectedScanIds, setSelectedScanIds] = useState<number[]>([]);
  const { loading, error, data } = useQuery(SESSION_QUERY, {
    variables: { username: useFedid() },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;
  if (data === undefined) {
    return <p>Data undefined</p>;
  }
  if (data.account === null) {
    return <p>Account null</p>;
  }

  /**
   * Based on the beamline changing when the session changes, update the technique to be the
   * default technique associated with the beamline, and update the template to be the first
   * template in the list of templates associated with the technique.
   */
  const updateTechniqueAndTemplate = (beamline: Beamline) => {
    const newTechnique = BEAMLINES_DEFAULT_TECHNIQUE[beamline];
    setTechnique(newTechnique);
    const filteredTemplates = filterTemplates(
      Technique[newTechnique as keyof typeof Technique]
    );
    setTemplate(filteredTemplates[0].value);
  };

  /**
   * Update the custom session and update the technique and template based on the beamline
   * associated with the newly chosen session.
   */
  const updateCustomSession = (session: InstrumentSession | null) => {
    setCustomSession(session);
    updateTechniqueAndTemplate(mapStringsToBeamline(session.instrument.name));
  };

  /**
   * Update the session-selection mode, and update the technique and template based on the
   * beamline associated with the newly chosen session.
   */
  const updateSessionSelectionMode = (mode: SessionSelectionMode) => {
    setSessionSelectionMode(mode);
    const session = determineCurrentSession(
      mode,
      data.account.instrumentSessionRoles.edges[0].node.instrumentSession,
      customSession
    );
    updateTechniqueAndTemplate(mapStringsToBeamline(session.instrument.name));
  };

  const handleChangeTechnique = (
    /**
     * This function handles the clicking of the toggle button which choose the technique and therefore determines which
     * workflows are filtered and shown the template drop down menu this then alteres the data state with new techniques
     * and templates
     */
    _event: React.MouseEvent<HTMLElement>,
    technique: string | null
  ) => {
    if (!technique) return;
    const filteredTemplates = filterTemplates(
      Technique[technique as keyof typeof Technique]
    );
    setTechnique(Technique[technique as keyof typeof Technique]);
    setTemplate(filteredTemplates[0].value);
  };

  const filterTechniques = (beamline: Beamline) => {
    if (showAllTechniques) {
      return Object.values(Technique);
    }

    return BEAMLINE_TECHNIQUES_SUBSET[beamline];
  };

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

  const getSessionSelector = (
    latestEnabled: boolean = true,
    session: InstrumentSession | null,
    sessionName: string | null
  ) => {
    return (
      <Box justifyItems="center">
        <Stack direction="row" spacing={2} alignItems="center" marginBottom={2}>
          <Typography variant="h5">Session</Typography>

          {/* Show chips only when session & sessionName are defined */}
          {session && sessionName ? (
            <>
              <Chip color="primary" variant="outlined" label={sessionName} />
              <Chip
                color="secondary"
                variant="outlined"
                label={session.instrument.name}
              />
            </>
          ) : (
            <></>
          )}
        </Stack>
        <SessionSelector
          setSession={updateCustomSession}
          mode={
            latestEnabled ? sessionSelectionMode : SessionSelectionMode.Custom
          }
          setMode={updateSessionSelectionMode}
          latestEnabled={latestEnabled}
        />
      </Box>
    );
  };

  const latestSessionAvailable =
    data.account.instrumentSessionRoles.edges.length > 0;

  // Case 1: No latest, no custom
  // Case 2: No latest, custom
  // Case 3: Latest

  if (customSession != null || latestSessionAvailable) {
    let session = customSession;
    // Get latest session, if available and latest session mode is selected
    if (latestSessionAvailable) {
      session = determineCurrentSession(
        sessionSelectionMode,
        data.account.instrumentSessionRoles.edges[0].node.instrumentSession,
        customSession
      );
    } else {
      session = customSession;
    }

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
    const currentTechnique = technique ?? BEAMLINES_DEFAULT_TECHNIQUE[beamline];
    const currentTemplate =
      template ?? filterTemplates(currentTechnique)[0].label;

    return (
      <>
        {/* Wrap the SessionSelector in a <Stack> as it the TextField won't remember
        the session text otherwise */}
        <Stack>
          {getSessionSelector(latestSessionAvailable, session, sessionName)}
        </Stack>

        <ApolloProvider client={apolloClientWorkflows}>
          <Grid container spacing={HORIZONTAL_SPACING} columns={2}>
            <Stack spacing={VERTICAL_SPACING} width="500px">
              <Accordion defaultExpanded>
                <AccordionSummary id="scan" expandIcon={<ChevronDown />}>
                  <Typography variant="h5">Scan</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ScanSelector
                    scanIds={selectedScanIds}
                    setScanIds={setSelectedScanIds}
                  />
                </AccordionDetails>
              </Accordion>

              <Accordion defaultExpanded>
                <AccordionSummary id="technique" expandIcon={<ChevronDown />}>
                  <Typography variant="h5">Technique</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <WorkflowForm
                    handleChangeTechnique={handleChangeTechnique}
                    showAllTechniques={showAllTechniques}
                    handleShowAllTechniques={(
                      e: React.ChangeEvent<HTMLInputElement>
                    ) => {
                      setShowAllTechniques(e.target.checked);
                      const isSelectedTechniqueInSubset =
                        BEAMLINE_TECHNIQUES_SUBSET[beamline].includes(
                          currentTechnique
                        );
                      if (!e.target.checked && !isSelectedTechniqueInSubset) {
                        updateTechniqueAndTemplate(beamline);
                      }
                    }}
                    filteredTechniques={filterTechniques(beamline)}
                    templateOptions={filterTemplates(currentTechnique)}
                    technique={currentTechnique}
                    template={currentTemplate}
                    setTemplate={setTemplate}
                  />
                </AccordionDetails>
              </Accordion>

              <Accordion defaultExpanded>
                <AccordionSummary
                  id="parameter-configuration"
                  expandIcon={<ChevronDown />}
                >
                  <Typography variant="h5">Parameter Configuration</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ParameterConfiguration
                    technique={currentTechnique}
                    template={currentTemplate}
                    setTemplate={setTemplate}
                    availableTemplates={filterTemplates(
                      Technique[currentTechnique as keyof typeof Technique]
                    )}
                    visit={selectedVisit}
                    beamline={beamline}
                    startTime={session.startTime}
                    scanIds={selectedScanIds}
                  />
                </AccordionDetails>
              </Accordion>
            </Stack>
            <JobsViewer visit={selectedVisit} />
          </Grid>
        </ApolloProvider>
      </>
    );
  } else {
    return (
      <>
        <Stack spacing={VERTICAL_SPACING}>
          {getSessionSelector(latestSessionAvailable, null, null)}
          <Typography variant="body1">
            Latest session not found. Please enter a session reference (e.g.
            ab12345-1).
          </Typography>
        </Stack>
        {/* Replicate the main grid here so our SessionSelector remains aligned */}
        <Grid container spacing={HORIZONTAL_SPACING} columns={2}>
          <Stack width="500px" />
          <Stack width="500px" />
        </Grid>
      </>
    );
  }
};
