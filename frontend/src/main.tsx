import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { CssBaseline } from "@mui/material";
import {
  ThemeProvider,
  DiamondDSTheme,
  AuthProvider,
} from "@diamondlightsource/sci-react-ui";
import { ApolloProvider } from "@apollo/client/react";
import { apolloClient } from "./ApolloClient";
import { updateTokenStore } from "./token";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider
      keycloakConfig={{
        url: import.meta.env.VITE_KEYCLOAK_URL,
        realm: import.meta.env.VITE_KEYCLOAK_REALM,
        clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
      }}
      onTokenChange={updateTokenStore}
    >
      <ApolloProvider client={apolloClient}>
        <ThemeProvider theme={DiamondDSTheme} defaultMode="light">
          <CssBaseline />
          <App />
        </ThemeProvider>
      </ApolloProvider>
    </AuthProvider>
  </StrictMode>
);
