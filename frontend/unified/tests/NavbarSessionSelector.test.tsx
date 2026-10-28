import React, { useState, ReactNode } from "react";
import "@testing-library/jest-dom";
import { expect, test, vi, afterEach } from "vitest";
import {
  act,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { Box } from "@mui/material";
import { MockedProvider } from "@apollo/client/testing/react";
import { NavbarSessionSelector } from "../src/components/NavbarSessionSelector";
import { SESSION_QUERY } from "../src/graphql/SessionQuery";
import { SESSIONSELECTOR_QUERY } from "../src/graphql/SessionSelectorQuery";
import { AppStatus, OutletContextType } from "../src/types";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import { AppWrapper } from "../src/AppWrapper";
import { SessionSelectorQueryVariables } from "../src/graphql/__generated__/SessionSelectorQuery.generated";

afterEach(() => {
  vi.clearAllMocks();
});

// Allow testing while using components that use `useOutletContext`
// https://stackoverflow.com/a/73854973
interface RenderRouteWithOutletContextProps<T> {
  context: T;
  children: ReactNode;
}

const RenderRouteWithOutletContext = <T,>({
  context,
  children,
}: RenderRouteWithOutletContextProps<T>) => {
  return (
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Outlet context={context as T} />}>
          <Route index element={children} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
};

const MAINAPP_ID = "mainapp-box";
const TestComponent = () => {
  const [appStatus, setAppStatus] = useState<AppStatus>({ state: "LOADING" });

  const ctx: OutletContextType = {
    appStatus: {
      appStatusVal: appStatus,
      setAppStatusVal: setAppStatus,
    },
  };

  return (
    <>
      <NavbarSessionSelector setAppStatus={setAppStatus} />
      <RenderRouteWithOutletContext context={ctx}>
        <AppWrapper
          renderItem={(_) => (
            // Use an empty box as a stand-in for the main app itself
            <Box sx={{ display: "flex" }} data-testid={MAINAPP_ID} />
          )}
        ></AppWrapper>
      </RenderRouteWithOutletContext>
    </>
  );
};

// Mock response for when there is no latest session available
const NO_LATEST_SESSION = {
  request: {
    query: SESSION_QUERY,
    variables: () => true,
  },
  result: {
    data: {
      account: {
        instrumentSessionRoles: {
          edges: [],
        },
      },
    },
  },
};

// Mock response for when there is a latest session available
const HAS_LATEST_SESSION = {
  request: {
    query: SESSION_QUERY,
    variables: () => true,
  },
  result: {
    data: {
      account: {
        instrumentSessionRoles: {
          edges: [
            {
              node: {
                instrumentSession: {
                  proposal: {
                    proposalNumber: 33746,
                    proposalCategory: "MG",
                    __typename: "Proposal",
                  },
                  instrumentSessionNumber: 1,
                  instrument: {
                    name: "DIAD",
                    key: "K11",
                    __typename: "Instrument",
                  },
                  startTime: "2023-01-20T09:00:00",
                  __typename: "InstrumentSession",
                },
                __typename: "InstrumentSessionRole",
              },
              __typename: "InstrumentSessionRoleEdge",
            },
          ],
          __typename: "InstrumentSessionRoleConnection",
        },
        __typename: "Account",
      },
    },
  },
};

// Mock response for a valid session string
const VALID_SESSIONSELECTOR_QUERY = {
  request: {
    query: SESSIONSELECTOR_QUERY,
    variables: () => true,
  },
  result: (variables: SessionSelectorQueryVariables) => {
    const { reference } = variables;

    const proposalCategory = reference.slice(0, 2);
    const proposalNumber = reference.slice(2, 7);
    const sessionNumber = reference.split("-")[1];

    return {
      data: {
        instrumentSessionByReference: {
          instrument: {
            name: "DIAD",
            key: "K11",
            __typename: "Instrument",
          },
          instrumentSessionNumber: Number(sessionNumber), // Populate based on variables
          proposal: {
            proposalNumber: Number(proposalNumber),
            proposalCategory: proposalCategory,
            __typename: "Proposal",
          },
          startTime: "2026-10-01T09:00:00",
          __typename: "InstrumentSession",
        },
      },
    };
  },
  maxUsageCount: 2,
};

// Mock response for a valid session string, but non-imaging beamline
const NON_IMAGING_BEAMLINE = "I18";
const VALID_SESSIONSELECTOR_QUERY_NON_IMAGING = {
  request: {
    query: SESSIONSELECTOR_QUERY,
    variables: () => true,
  },
  result: (variables: SessionSelectorQueryVariables) => {
    const { reference } = variables;

    const proposalCategory = reference.slice(0, 2);
    const proposalNumber = reference.slice(2, 7);
    const sessionNumber = reference.split("-")[1];

    return {
      data: {
        instrumentSessionByReference: {
          instrument: {
            name: NON_IMAGING_BEAMLINE,
            key: NON_IMAGING_BEAMLINE,
            __typename: "Instrument",
          },
          instrumentSessionNumber: Number(sessionNumber), // Populate based on variables
          proposal: {
            proposalNumber: Number(proposalNumber),
            proposalCategory: proposalCategory,
            __typename: "Proposal",
          },
          startTime: "2026-10-01T09:00:00",
          __typename: "InstrumentSession",
        },
      },
    };
  },
};

// Mock response for an invalid session string
const INVALID_SESSIONSELECTOR_QUERY = {
  request: {
    query: SESSIONSELECTOR_QUERY,
    variables: () => true,
  },
  result: {
    data: {
      instrumentSessionByReference: null,
    },
  },
};

const noLatestSessionMock = [NO_LATEST_SESSION];
test("test handling of non-existent latest session", async () => {
  await act(() =>
    render(
      <MockedProvider mocks={noLatestSessionMock}>
        <TestComponent />
      </MockedProvider>
    )
  );

  // Check that loading spinner is displayed
  expect(screen.queryByRole("progressbar")).toBeInTheDocument();

  // Wait for message to appear
  await waitFor(() =>
    expect(screen.getByTestId("appstate-msg")).toHaveTextContent(
      "Latest session not found. Please enter a session reference above (e.g. ab12345-1)."
    )
  );

  // Check that the latest session button is not visible
  await waitFor(() =>
    expect(screen.queryByText("Latest")).not.toBeInTheDocument()
  );
});

const latestSessionMock = [HAS_LATEST_SESSION, VALID_SESSIONSELECTOR_QUERY];
test("test handling of latest session", async () => {
  await act(() =>
    render(
      <MockedProvider mocks={latestSessionMock}>
        <TestComponent />
      </MockedProvider>
    )
  );

  // Check that loading spinner is displayed
  expect(screen.queryByRole("progressbar")).toBeInTheDocument();

  // Wait for progressbar to disappear
  await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

  // Check that session selector has latest session in input
  const input = await screen.findByRole("textbox");
  const EXPECTED = "mg33746-1";
  expect(input).toHaveDisplayValue(EXPECTED);

  // Check that the main app is being rendered
  await screen.findByTestId(MAINAPP_ID);

  // Check that the latest button is enabled
  expect(screen.getByText("Latest")).toBeEnabled();
});

test("test clicking of latest button", async () => {
  const user = userEvent.setup();

  await act(() =>
    render(
      <MockedProvider mocks={latestSessionMock}>
        <TestComponent />
      </MockedProvider>
    )
  );

  // Check that loading spinner is displayed
  expect(screen.queryByRole("progressbar")).toBeInTheDocument();

  // Wait for progressbar to disappear
  await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

  // 1. Check that session selector has latest session in input
  const input = await screen.findByRole("textbox");
  const LATEST_SESSION = "mg33746-1";
  expect(input).toHaveDisplayValue(LATEST_SESSION);

  // Check that the main app is being rendered
  await screen.findByTestId(MAINAPP_ID);

  // 2. Type new session reference
  const INPUT = "mg44685-1";
  await user.clear(input);
  await user.type(input, INPUT);

  // 3. Check that new session reference is in textbox
  expect(input).toHaveDisplayValue(INPUT);

  // 4. Click the latest button
  const latestButton = screen.getByText("Latest");
  await user.click(latestButton);

  // 5. Check that textbox has latest session reference
  expect(input).toHaveDisplayValue(LATEST_SESSION);
});

test("invalid session selector input - regex failure", async () => {
  const user = userEvent.setup();

  await act(() =>
    render(
      <MockedProvider mocks={noLatestSessionMock}>
        <TestComponent />
      </MockedProvider>
    )
  );

  // Wait for progressbar to disappear
  await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

  // Type 'fail :(' into the session selector textbox
  const input = await screen.findByRole("textbox");
  const INPUT = "fail :(";
  await user.type(input, INPUT);

  expect(screen.getByTestId("appstate-msg")).toHaveTextContent(
    "Session must be of the following format: ab12345-1"
  );
});

const invalidSessionMock = [NO_LATEST_SESSION, INVALID_SESSIONSELECTOR_QUERY];
test("invalid session selector input - session not found", async () => {
  const user = userEvent.setup();

  await act(() =>
    render(
      <MockedProvider mocks={invalidSessionMock}>
        <TestComponent />
      </MockedProvider>
    )
  );

  // Wait for progressbar to disappear
  await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

  // Type invalid session reference into textbox
  const input = screen.getByRole("textbox");
  const INPUT = "mg44685-1";
  await user.type(input, INPUT);

  await waitFor(() =>
    expect(screen.getByTestId("appstate-msg")).toHaveTextContent(
      `Invalid session: Session ${INPUT} not found.`
    )
  );
});

const validSessionMock = [NO_LATEST_SESSION, VALID_SESSIONSELECTOR_QUERY];
test("valid session selector input", async () => {
  const user = userEvent.setup();

  await act(() =>
    render(
      <MockedProvider mocks={validSessionMock}>
        <TestComponent />
      </MockedProvider>
    )
  );

  // Wait for progressbar to disappear
  await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

  // Type valid session reference into textbox
  const input = screen.getByRole("textbox");
  const SESSION = "mg44685-1";
  await user.type(input, SESSION);

  // Wait for progressbar to disappear
  await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

  // Check that the main app is being rendered
  await waitFor(() =>
    expect(screen.getByTestId(MAINAPP_ID)).toBeInTheDocument()
  );
});

const nonImagingMock = [
  NO_LATEST_SESSION,
  VALID_SESSIONSELECTOR_QUERY_NON_IMAGING,
];
test("handle non-imaging beamline", async () => {
  const user = userEvent.setup();

  await act(() =>
    render(
      <MockedProvider mocks={nonImagingMock}>
        <TestComponent />
      </MockedProvider>
    )
  );

  // Wait for progressbar to disappear
  await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

  const INPUT = "ab12345-1";
  const input = screen.getByRole("textbox");
  await user.type(input, INPUT);

  // Wait for progressbar to disappear
  await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

  await waitFor(() =>
    expect(screen.getByTestId("appstate-msg")).toHaveTextContent(
      `Invalid session: Session ${INPUT} is associated with ${NON_IMAGING_BEAMLINE}. ${NON_IMAGING_BEAMLINE} is not an imaging beamline.`
    )
  );
});
