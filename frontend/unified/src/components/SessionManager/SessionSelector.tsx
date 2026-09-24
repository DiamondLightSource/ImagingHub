import { gql, TypedDocumentNode } from "@apollo/client";
import {
  GetSessionByReferenceQuery,
  GetSessionByReferenceQueryVariables,
} from "./__generated__/SessionSelector.generated";
import { SessionQueryQuery } from "./__generated__/SessionManager.generated";
import React, { useEffect, useState } from "react";
import { Beamline, SessionSelectionMode } from "../../types";
import { Visit, visitRegex } from "@diamondlightsource/sci-react-ui";
import {
  Button,
  OutlinedInput,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import { useQuery } from "@apollo/client/react";
import { InfoIcon } from "lucide-react";

export const GET_SESSION_BY_REFERENCE: TypedDocumentNode<
  GetSessionByReferenceQuery,
  GetSessionByReferenceQueryVariables
> = gql`
  query GetSessionByReference($reference: String!) {
    instrumentSessionByReference(reference: $reference) {
      instrument {
        name
      }
      instrumentSessionNumber
      proposal {
        proposalNumber
        proposalCategory
      }
      startTime
    }
  }
`;

type NonNullAccount = NonNullable<SessionQueryQuery["account"]>;

export type InstrumentSession =
  NonNullAccount["instrumentSessionRoles"]["edges"][0]["node"]["instrumentSession"];

const SessionSelector = ({
  latestSession,
  beamline,
  setBeamline,
  visit,
  setVisit,
}: {
  latestSession: InstrumentSession;
  beamline: Beamline | null;
  setBeamline: (_: Beamline | null) => void;
  visit: Visit | null;
  setVisit: (_: Visit | null) => void;
}) => {
  const [sessionSelectionMode, setSessionSelectionMode] =
    useState<SessionSelectionMode>(SessionSelectionMode.Latest);
  const [customSession, setCustomSession] =
    useState<InstrumentSession>(latestSession);

  useEffect(() => {
    if (!beamline) {
      setBeamline(latestSession.instrument.name as Beamline);
    }

    if (!visit) {
      setVisit({
        proposalCode: latestSession.proposal.proposalCategory?.toLowerCase(),
        proposalNumber: latestSession.proposal.proposalNumber,
        number: latestSession.instrumentSessionNumber,
      } as Visit);
    }
  }, [
    beamline,
    setBeamline,
    visit,
    setVisit,
    latestSession.instrument.name,
    latestSession.proposal.proposalNumber,
    latestSession.proposal.proposalCategory,
    latestSession.instrumentSessionNumber,
  ]);

  const handleChange = (
    _: React.MouseEvent<HTMLElement>,
    toggleButtonLabel: string
  ) => {
    if (toggleButtonLabel === SessionSelectionMode.Latest) {
      setSessionSelectionMode(toggleButtonLabel);
      setVisit({
        proposalCode: latestSession.proposal.proposalCategory?.toLowerCase(),
        proposalNumber: latestSession.proposal.proposalNumber,
        number: latestSession.instrumentSessionNumber,
      } as Visit);
      setBeamline(latestSession.instrument.name as Beamline);
    } else if (toggleButtonLabel === SessionSelectionMode.Custom) {
      setSessionSelectionMode(toggleButtonLabel);
      setVisit({
        proposalCode: customSession.proposal.proposalCategory?.toLowerCase(),
        proposalNumber: customSession.proposal.proposalNumber,
        number: customSession.instrumentSessionNumber,
      } as Visit);
      setBeamline(customSession.instrument.name as Beamline);
    }
  };

  return (
    <Stack direction="row" spacing={1}>
      <ToggleButtonGroup
        exclusive
        value={sessionSelectionMode}
        onChange={handleChange}
      >
        <ToggleButton value={SessionSelectionMode.Latest}>
          {SessionSelectionMode.Latest}
        </ToggleButton>
        <ToggleButton value={SessionSelectionMode.Custom}>
          {SessionSelectionMode.Custom}
        </ToggleButton>
      </ToggleButtonGroup>
      <CustomSessionInput
        sessionSelectionMode={sessionSelectionMode}
        setCustomSession={setCustomSession}
        setVisit={setVisit}
        setBeamline={setBeamline}
      />
    </Stack>
  );
};

const CustomSessionInput = ({
  sessionSelectionMode,
  setCustomSession,
  setVisit,
  setBeamline,
}: {
  sessionSelectionMode: SessionSelectionMode;
  setCustomSession: (_: InstrumentSession) => void;
  setVisit: (_: Visit) => void;
  setBeamline: (_: Beamline) => void;
}) => {
  const [input, setInput] = useState<string>("");
  const [pressed, setPressed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isErrored, setIsErrored] = useState<boolean>(false);
  const [helperText, setHelperText] = useState<string>(
    "Session format: ab12345-1"
  );

  const disabled = sessionSelectionMode !== SessionSelectionMode.Custom;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    setInput(text);
    if (visitRegex.exec(text) === null) {
      setIsErrored(true);
      setHelperText("Session format: ab12345-1");
    } else {
      setIsErrored(false);
      setHelperText("");
    }
  };

  return (
    <>
      <OutlinedInput
        error={isErrored}
        disabled={disabled}
        onChange={handleChange}
        endAdornment={
          <Tooltip title={helperText}>
            <InfoIcon />
          </Tooltip>
        }
      />
      <Button
        disabled={disabled}
        loading={loading}
        variant="contained"
        color="primary"
        onClick={() => {
          setPressed(true);
        }}
      >
        Submit
      </Button>
      {pressed && (
        <RunQuery
          input={input}
          setLoading={setLoading}
          setVisit={setVisit}
          setBeamline={setBeamline}
          setCustomSession={setCustomSession}
          setIsErrored={setIsErrored}
          setHelperText={setHelperText}
          setPressed={setPressed}
        />
      )}
    </>
  );
};

const RunQuery = ({
  input,
  setLoading,
  setVisit,
  setBeamline,
  setCustomSession,
  setIsErrored,
  setHelperText,
  setPressed,
}: {
  input: string;
  setLoading: (_: boolean) => void;
  setVisit: (_: Visit) => void;
  setBeamline: (_: Beamline) => void;
  setCustomSession: (_: InstrumentSession) => void;
  setIsErrored: (_: boolean) => void;
  setHelperText: (_: string) => void;
  setPressed: (_: boolean) => void;
}) => {
  const { data, error, loading } = useQuery(GET_SESSION_BY_REFERENCE, {
    variables: { reference: input },
  });

  useEffect(() => {
    if (loading) setLoading(true);
    if (error) {
      setIsErrored(true);
      setHelperText(`Error: ${error.message}`);
      setLoading(false);
      setPressed(false);
    }

    if (data) {
      const fetchedBeamline =
        data.instrumentSessionByReference?.instrument.name;
      if (data.instrumentSessionByReference === null) {
        setIsErrored(true);
        setHelperText(`Session ${input} does not exist`);
        setLoading(false);
        setPressed(false);
      } else if (
        !Object.values(Beamline).includes(fetchedBeamline as Beamline)
      ) {
        setIsErrored(true);
        setHelperText(`${input} is not associated with an imaging beamline`);
        setLoading(false);
        setPressed(false);
      } else {
        setCustomSession(data.instrumentSessionByReference);
        setVisit({
          proposalCode:
            data.instrumentSessionByReference.proposal.proposalCategory?.toLowerCase(),
          proposalNumber:
            data.instrumentSessionByReference.proposal.proposalNumber,
          number: data.instrumentSessionByReference.instrumentSessionNumber,
        } as Visit);
        setBeamline(fetchedBeamline as Beamline);
        setLoading(false);
        setPressed(false);
      }
    }
  });
  return null;
};

export default SessionSelector;
