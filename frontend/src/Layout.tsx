import React, { useState } from "react";
import {
  Outlet,
  NavLink as RouterNavLink,
  useOutletContext,
} from "react-router-dom";
import { Box, CssBaseline, styled, Alert, Stack, Divider } from "@mui/material";
import {
  ColourSchemeButton,
  Footer,
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
import {
  AppState,
  InstrumentSession,
  OutletContextType,
} from "../unified/src/types";

const MainContainer = styled(Box)({
  display: "grid",
  gap: "30px",
  padding: "20px",
  flex: 1,
  alignItems: "flex-start",
  margin: "30px auto",
});

const Layout = () => {
  const auth = useAuth();

  const [selectedSession, setSelectedSession] =
    useState<InstrumentSession | null>(null);

  const [appState, setAppState] = useState<AppState>(AppState.LOADING);

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
    session: {
      sessionVal: selectedSession,
      setSessionVal: setSelectedSession,
    },
    appState: {
      appStateVal: appState,
      setAppStateVal: setAppState,
    },
  };

  return (
    <>
      <CssBaseline />
      <Navbar
        logo="theme"
        containerWidth={false}
        leftSlot={
          <>
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
                <NavbarSessionSelector
                  setSession={setSelectedSession}
                  setAppState={setAppState}
                />
              </ApolloProvider>
            </Stack>
          </>
        }
        rightSlot={
          <>
            <User color="white" auth={auth} />
            <ColourSchemeButton />
          </>
        }
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        position="fixed"
      ></Navbar>
      <MainContainer>
        <Outlet context={ctx satisfies OutletContextType} />
      </MainContainer>
      <Footer
        copyright=""
        logo="theme"
        style={{
          width: "100%",
          backgroundColor: "#4C5266",
          display: "flex",
          justifyContent: "center",
        }}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      ></Footer>
    </>
  );
};

export function useOutletContextTyped() {
  return useOutletContext<OutletContextType>();
}

export default Layout;
