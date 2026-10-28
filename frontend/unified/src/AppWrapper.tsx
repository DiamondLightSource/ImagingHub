import React, { ReactNode } from "react";
import { useOutletContextTyped } from "../../src/Layout";

import { Alert, Box } from "@mui/material";

import { Progress } from "@diamondlightsource/sci-react-ui";
import { InstrumentSession } from "./types";

const VERTICAL_SPACING = 2;

type AppWrapperProps = {
  renderItem: (v: InstrumentSession) => ReactNode;
};
export const AppWrapper: React.FC<AppWrapperProps> = ({
  renderItem,
}: AppWrapperProps) => {
  const outletCtx = useOutletContextTyped();

  const { appStatusVal } = outletCtx.appStatus;

  console.log("appstatus", appStatusVal);

  switch (appStatusVal.state) {
    case "VALID": {
      // Render the main app
      return renderItem(appStatusVal.session);
    }
    case "LOADING": {
      return (
        <Box sx={{ p: VERTICAL_SPACING }}>
          <Progress data-testid="loading-spinner" />
        </Box>
      );
    }
    case "LATEST_NOT_FOUND": {
      return (
        <Box sx={{ p: VERTICAL_SPACING }}>
          <Alert severity="info" variant="standard" data-testid="appstate-msg">
            Latest session not found. Please enter a session reference above
            (e.g. ab12345-1).
          </Alert>
        </Box>
      );
    }
    case "INVALID_SESSION": {
      return (
        <Box sx={{ p: VERTICAL_SPACING }}>
          <Alert
            severity="warning"
            variant="standard"
            data-testid="appstate-msg"
          >
            {appStatusVal.message}
          </Alert>
        </Box>
      );
    }
    case "FAILED_REGEX": {
      return (
        <Box sx={{ p: VERTICAL_SPACING }}>
          <Alert severity="info" variant="standard" data-testid="appstate-msg">
            Session must be of the following format: ab12345-1
          </Alert>
        </Box>
      );
    }

    case "ERROR": {
      return (
        <Box sx={{ p: VERTICAL_SPACING }}>
          <Alert severity="error" variant="standard" data-testid="appstate-msg">
            {appStatusVal.message}
          </Alert>
        </Box>
      );
    }
  }
};
