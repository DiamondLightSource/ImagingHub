import React from "react";
import { Outlet, NavLink as RouterNavLink } from "react-router-dom";
import { Box, CssBaseline, styled, Alert } from "@mui/material";
import {
  Footer,
  Navbar,
  NavLink,
  NavLinks,
  User,
  useAuth,
  ProgressDelayed,
} from "@diamondlightsource/sci-react-ui";

const AppContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  alignItems: "center",
  backgroundColor: "#fff",
  overflowX: "hidden",
});

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

  if (auth.errors) {
    return <Alert severity="error">{auth.errors.join(", ")}</Alert>;
  }

  if (!auth.initialised) {
    return <ProgressDelayed />;
  }

  if (!auth.authenticated) {
    auth.login();
  }

  return (
    <>
      <CssBaseline />
      <AppContainer>
        <Navbar
          logo="theme"
          leftSlot={
            <NavLinks>
              <NavLink to="/" linkComponent={RouterNavLink}>
                Home
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
          }
          rightSlot={<User color="white" auth={auth} />}
        ></Navbar>
        <MainContainer>
          <Outlet />
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
        ></Footer>
      </AppContainer>
    </>
  );
};

export default Layout;
