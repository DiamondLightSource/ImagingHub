import {
  Stack,
  Divider,
  Typography,
  TextField,
  InputAdornment,
  Button,
} from "@mui/material";
import { FlaskConical } from "lucide-react";
import { SessionQuery } from "../graphql/__generated__/SessionQuery.generated";
import { useQuery } from "@apollo/client/react";
import { useEffect, useRef, useState } from "react";
import { SESSIONSELECTOR_QUERY } from "../graphql/SessionSelectorQuery";
import { SESSION_QUERY } from "../graphql/SessionQuery";
import { useAuth } from "@diamondlightsource/sci-react-ui";

type NonNullAccount = NonNullable<SessionQuery["account"]>;
export type InstrumentSession =
  NonNullAccount["instrumentSessionRoles"]["edges"][0]["node"]["instrumentSession"];

export type SessionRefState = {
  selectedSession: InstrumentSession;
  setSelectedSession: (v: InstrumentSession) => void;
};

export type OutletContextType = {
  session: SessionRefState;
};

const useFedid = (): string => {
  const token = useAuth().getToken();
  const parseToken = JSON.parse(atob(token.split(".")[1]));
  return parseToken.fedid;
};

type NavbarSessionSelectorProps = {
  setSession: (v: InstrumentSession) => void;
};
export const NavbarSessionSelector: React.FC<NavbarSessionSelectorProps> = ({
  setSession,
}: NavbarSessionSelectorProps) => {
  const [sessionInputValue, setSessionInputValue] = useState("");
  const [beamline, setBeamline] = useState("");

  const latestSession = useRef<string>("");

  const { data: accountData } = useQuery(SESSION_QUERY, {
    // variables: { username: useFedid() },
    variables: { username: "twi18192" },
  });

  const { data } = useQuery(SESSIONSELECTOR_QUERY, {
    variables: { reference: sessionInputValue },
  });

  useEffect(() => {
    if (data && data.instrumentSessionByReference) {
      console.log("data ", data, data.instrumentSessionByReference);
      setSession(data.instrumentSessionByReference);
      setBeamline(data.instrumentSessionByReference.instrument.name);
    } else {
      setSession(null);
      setBeamline("");
    }
  }, [data, setSession]);

  useEffect(() => {
    console.log("accountData");
    if (accountData) {
      const latestSessionAvailable =
        accountData.account.instrumentSessionRoles.edges.length > 0;
      if (latestSessionAvailable) {
        const instSess =
          accountData.account.instrumentSessionRoles.edges[0].node
            .instrumentSession;
        latestSession.current = `${instSess.proposal.proposalCategory.toLowerCase()}${instSess.proposal.proposalNumber}-${instSess.instrumentSessionNumber}`;
        setSessionInputValue(latestSession.current);
      }
    }
  }, [accountData]);

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="flex-start"
      // divider={<Divider orientation="vertical" flexItem />}
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
            // color: "primary.onContainer",
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
