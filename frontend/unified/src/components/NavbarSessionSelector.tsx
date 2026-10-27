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
import { AppState, AppStatus, Beamline } from "../types";

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
  setAppStatus: (v: AppStatus) => void;
};
export const NavbarSessionSelector: React.FC<NavbarSessionSelectorProps> = ({
  setAppStatus: setAppStatus,
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

  const isLoading = loading || accountLoading;

  useEffect(() => {
    if (isLoading) {
      setAppStatus({ state: AppState.LOADING });
    }
  }, [isLoading, setAppStatus]);

  useEffect(() => {
    if (accountError) {
      setAppStatus({ state: AppState.ERROR, message: accountError.message });
    } else if (error) {
      setAppStatus({ state: AppState.ERROR, message: error.message });
    }
  }, [accountError, error, setAppStatus]);

  // Handle loading of main session data
  useEffect(() => {
    if (data) {
      if (data.instrumentSessionByReference) {
        const beamlineName = data.instrumentSessionByReference.instrument.name;
        if (Object.keys(Beamline).includes(beamlineName)) {
          setBeamline(beamlineName);
          setAppStatus({
            state: AppState.VALID,
            session: data.instrumentSessionByReference,
          });
        } else {
          setBeamline(beamlineName);
          setAppStatus({
            state: AppState.INVALID_SESSION,
            message: `Invalid session: Session ${sessionInputValue} is associated with ${beamlineName}. ${beamlineName} is not an imaging beamline.`,
          });
        }
      } else {
        setAppStatus({
          state: AppState.INVALID_SESSION,
          message: `Invalid session: Session ${sessionInputValue} not found.`,
        });
      }
    }
  }, [data, sessionInputValue, setAppStatus]);

  // Handle query for visits associated with user
  useEffect(() => {
    if (accountData) {
      const instSess =
        accountData?.account?.instrumentSessionRoles?.edges?.[0]?.node
          ?.instrumentSession;
      if (instSess) {
        const latest = `${instSess.proposal.proposalCategory?.toLowerCase()}${instSess.proposal.proposalNumber}-${instSess.instrumentSessionNumber}`;
        latestSession.current = latest;
        setSessionInputValue(latest);
      } else {
        setAppStatus({ state: AppState.LATEST_NOT_FOUND });
      }
    }
  }, [accountData, setAppStatus]);

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
              setAppStatus({ state: AppState.FAILED_REGEX });
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

        {latestSession.current !== "" ? (
          <Button
            variant="contained"
            onClick={() => {
              setSessionInputValue(latestSession.current);
            }}
          >
            Latest
          </Button>
        ) : (
          <></>
        )}
      </Stack>
    </Stack>
  );
};
