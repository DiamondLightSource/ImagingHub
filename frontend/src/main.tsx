import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { CssBaseline } from "@mui/material";
import {
  ThemeProvider,
  DiamondDSTheme,
} from "@diamondlightsource/sci-react-ui";
import { RelayEnvironmentProvider } from "react-relay";
import { getRelayEnvironment } from "./RelayEnvironment";

getRelayEnvironment().then((environment) => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <ThemeProvider theme={DiamondDSTheme} defaultMode="light">
        <CssBaseline />
        <RelayEnvironmentProvider environment={environment}>
          <App />
        </RelayEnvironmentProvider>
      </ThemeProvider>
    </StrictMode>
  );
});
