import React, { useState } from "react";
import {
  Outlet,
  NavLink as RouterNavLink,
  useOutletContext,
} from "react-router-dom";
import { Box, CssBaseline, styled, Alert, Stack, Divider } from "@mui/material";
import {
  ColourSchemeButton,
  Navbar,
  NavLink,
  NavLinks,
  User,
  useAuth,
  ProgressDelayed,
} from "@diamondlightsource/sci-react-ui";
import { NavbarSessionSelector } from "../unified/src/components/NavbarSessionSelector";
import { apolloClientUlims } from "./ApolloClient";
import { ApolloProvider } from "@apollo/client/react";
import { AppState, AppStatus, OutletContextType } from "../unified/src/types";

const MainContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "30px",
  minHeight: 0,
  flexGrow: 1,
});

const Layout = () => {
  const auth = useAuth();

  const [appStatus, setAppStatus] = useState<AppStatus>({
    state: AppState.LOADING,
  });

  if (auth.errors) {
    return <Alert severity="error">{auth.errors.join(", ")}</Alert>;
  }

  if (!auth.initialised) {
    return <ProgressDelayed />;
  }

  if (!auth.authenticated) {
    auth.login();
  }

  const ctx: OutletContextType = {
    appStatus: {
      appStatusVal: appStatus,
      setAppStatusVal: setAppStatus,
    },
  };

  return (
    <Box
      sx={{
        height: "100vh",
        maxHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CssBaseline />
      <Navbar
        logo="theme"
        containerWidth={false}
        position="sticky"
        leftSlot={
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            divider={<Divider orientation="vertical" flexItem />}
          >
            <NavLinks>
              <NavLink to="/" linkComponent={RouterNavLink}>
                Home
              </NavLink>
              <NavLink to="/post-processing" linkComponent={RouterNavLink}>
                Post Processing
              </NavLink>
              <NavLink to="/tomography" linkComponent={RouterNavLink}>
                Tomography
              </NavLink>
              <NavLink to="/i14" linkComponent={RouterNavLink}>
                I14
              </NavLink>
              <NavLink to="/ePSIC" linkComponent={RouterNavLink}>
                ePSIC
              </NavLink>
            </NavLinks>

            <ApolloProvider client={apolloClientUlims}>
              <NavbarSessionSelector setAppStatus={setAppStatus} />
            </ApolloProvider>
          </Stack>
        }
        rightSlot={
          <>
            <User color="white" auth={auth} />
            <ColourSchemeButton />
          </>
        }
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      />
      <MainContainer>
        <Outlet context={ctx satisfies OutletContextType} />
      </MainContainer>
    </Box>
  );
};

export function useOutletContextTyped() {
  return useOutletContext<OutletContextType>();
}

export default Layout;
