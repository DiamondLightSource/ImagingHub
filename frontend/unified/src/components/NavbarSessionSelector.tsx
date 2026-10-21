import {
  Stack,
  Typography,
  TextField,
  InputAdornment,
  Button,
} from "@mui/material";
import React from "react";
import { FlaskConical } from "lucide-react";
import { useQuery } from "@apollo/client/react";
import { useEffect, useRef, useState } from "react";
import { SESSIONSELECTOR_QUERY } from "../graphql/SessionSelectorQuery";
import { SESSION_QUERY } from "../graphql/SessionQuery";
import { useAuth, visitRegex } from "@diamondlightsource/sci-react-ui";
import { AppState, InstrumentSession } from "../types";

const useFedid = (): string => {
  const token = useAuth().getToken();
  try {
    const parseToken = JSON.parse(atob(token.split(".")[1]));
    return parseToken.fedid;
  } catch {
    return "";
  }
};

type NavbarSessionSelectorProps = {
  setSession: (v: InstrumentSession) => void;
  setAppState: (v: AppState) => void;
};
export const NavbarSessionSelector: React.FC<NavbarSessionSelectorProps> = ({
  setSession,
  setAppState: setAppState,
}: NavbarSessionSelectorProps) => {
  const [sessionInputValue, setSessionInputValue] = useState("");
  const [beamline, setBeamline] = useState("");

  const latestSession = useRef<string>("");

  const {
    data: accountData,
    loading: accountLoading,
    error: accountError,
  } = useQuery(SESSION_QUERY, {
    variables: { username: useFedid() },
  });

  const { data, loading, error } = useQuery(SESSIONSELECTOR_QUERY, {
    variables: { reference: sessionInputValue },
    skip: visitRegex.exec(sessionInputValue) === null, // Don't perform the query if the input doesn't match the regex
  });

  // Handle loading of main session data
  useEffect(() => {
    if (data && data.instrumentSessionByReference) {
      setSession(data.instrumentSessionByReference);
      setBeamline(data.instrumentSessionByReference.instrument.name);
      setAppState(AppState.VALID);
    } else {
      setSession(null);
      setBeamline("");
      if (error) {
        setAppState(AppState.ERROR);
      } else if (loading || accountLoading) {
        setAppState(AppState.LOADING);
      } else if (visitRegex.exec(sessionInputValue) === null) {
        setAppState(AppState.FAILED_REGEX);
      } else {
        setAppState(AppState.INVALID_SESSION);
      }
    }
  }, [data, error, loading]);

  // Handle query for visits associated with user
  useEffect(() => {
    if (accountData) {
      const latestSessionAvailable =
        accountData.account.instrumentSessionRoles.edges.length > 0;
      if (latestSessionAvailable) {
        const instSess =
          accountData.account.instrumentSessionRoles.edges[0].node
            .instrumentSession;
        latestSession.current = `${instSess.proposal.proposalCategory.toLowerCase()}${instSess.proposal.proposalNumber}-${instSess.instrumentSessionNumber}`;
        setSessionInputValue(latestSession.current);
      } else {
        setAppState(AppState.LATEST_NOT_FOUND);
      }
    } else if (accountError) {
      setAppState(AppState.ERROR);
    } else if (accountLoading) {
      setAppState(AppState.LOADING);
    }
  }, [accountData, accountError, setAppState]);

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="flex-start"
      spacing={2}
    >
      <Typography
        variant="h6"
        align="right"
        overflow="auto"
        sx={{
          width: "50px",
        }}
      >
        {beamline}
      </Typography>

      <Stack direction="row" spacing={2}>
        <TextField
          placeholder="Session"
          size="small"
          value={sessionInputValue}

          sx={{
            marginLeft: 2,

            "& .MuiOutlinedInput-root": {
              backgroundColor: "primary.container",

              // Default border
              "& fieldset": {
                borderColor: "primary.light",
              },
              // Hover border
              "&:hover fieldset": {
                borderColor: "primary.light",
              },
              // Focused border
              "&.Mui-focused fieldset": (theme) => ({
                borderColor: `${theme.palette.primary.light} !important`,
              }),
            },

            // Set placeholder text colour
            // https://stackoverflow.com/a/75359780
            "& .MuiInputBase-root.MuiOutlinedInput-root ::placeholder": {
              color: "primary.onContainer",
              opacity: 0.7, // otherwise firefox shows a lighter color
            },

            // Set main text colour
            // https://stackoverflow.com/a/69878855
            input: {
              color: "primary.onContainer",
            },
          }}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            if (visitRegex.exec(event.target.value) === null) {
              setAppState(AppState.FAILED_REGEX);
            }
            setSessionInputValue(event.target.value);
          }}

          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment
                  position="start"
                  sx={{ color: "primary.onContainer" }}
                >
                  <FlaskConical />
                </InputAdornment>
              ),
            },
          }}
        />

        <Button
          variant="contained"
          disabled={latestSession.current == ""}
          onClick={() => {
            setSessionInputValue(latestSession.current);
          }}
        >
          Latest
        </Button>
      </Stack>
    </Stack>
  );
};
