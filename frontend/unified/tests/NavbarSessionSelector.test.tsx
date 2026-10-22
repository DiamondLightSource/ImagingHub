import React from "react";
import "@testing-library/jest-dom";
import { expect, test, vi, afterEach } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing/react";
import { NavbarSessionSelector } from "../src/components/NavbarSessionSelector";
import { SESSION_QUERY } from "../src/graphql/SessionQuery";
import { SESSIONSELECTOR_QUERY } from "../src/graphql/SessionSelectorQuery";
import { AppState, AppStatus } from "../src/types";
import userEvent from "@testing-library/user-event";

afterEach(() => {
  vi.clearAllMocks();
});

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
  result: (variables) => {
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
};

// Mock response for a valid session string, but non-imaging beamline
const NON_IMAGING_BEAMLINE = "I18";
const VALID_SESSIONSELECTOR_QUERY_NON_IMAGING = {
  request: {
    query: SESSIONSELECTOR_QUERY,
    variables: () => true,
  },
  result: (variables) => {
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

type MockCall<T> = {
  arg: T;
  occurrence: number;
};
function removeDuplicates(arr: AppStatus[][]): MockCall<AppState>[] {
  // Removes consecutive duplicates from call array
  // Instead returns a list of arguments and their occurrences
  // e.g. [['arg', 1], ['arg2', 5]]

  const out: MockCall<AppState>[] = [];
  let prev = null;
  for (const v of arr) {
    if (v[0].state !== prev) {
      out.push({ arg: v[0].state, occurrence: 1 });
      prev = v[0].state;
    } else {
      out.slice(-1)[0].occurrence += 1;
    }
  }

  return out;
}
function getValue(elem: MockCall<AppState>): AppState {
  return elem.arg;
}
function getOccurrence<T>(elem: MockCall<T>): number {
  return elem.occurrence;
}
function expectStartup(arr: MockCall<AppState>[], value: AppState) {
  expect(getValue(arr[0])).toStrictEqual(AppState.LOADING);
  expect(getValue(arr[1])).toStrictEqual(value);
}

// Test latest session not available
const noLatestSessionMock = [NO_LATEST_SESSION];
test("latest session does not exist", async () => {
  const setAppState = vi.fn();
  const setSession = vi.fn();

  await act(() =>
    render(
      <MockedProvider mocks={noLatestSessionMock}>
        <NavbarSessionSelector
          setAppStatus={setAppState}
          setSession={setSession}
        />
      </MockedProvider>
    )
  );

  // Wait for the last call
  await waitFor(() =>
    expect(setAppState).lastCalledWith({ state: AppState.LATEST_NOT_FOUND })
  );

  // Remove duplicate calls, as calling setState() with the same arguments
  // doesn't result in a rerender
  const dedup = removeDuplicates(setAppState.mock.calls);
  expect(
    dedup.slice(0, -1).every((v) => getValue(v) === AppState.LOADING)
  ).toBeTruthy();
  expect(getValue(dedup.slice(-1)[0])).toStrictEqual(AppState.LATEST_NOT_FOUND);
});

// Test invalid session selector input - regex failure
test("session regex failure", async () => {
  const user = userEvent.setup();

  const setAppState = vi.fn();
  const setSession = vi.fn();

  await act(() =>
    render(
      <MockedProvider mocks={noLatestSessionMock}>
        <NavbarSessionSelector
          setSession={setSession}
          setAppStatus={setAppState}
        />
      </MockedProvider>
    )
  );

  const input = screen.getByRole("textbox");

  // Wait for initial request to check if latest session exists
  await waitFor(() =>
    expect(setAppState).calledWith({ state: AppState.LATEST_NOT_FOUND })
  );

  const INPUT = "fail :(";
  await user.type(input, INPUT);

  const dedup = removeDuplicates(setAppState.mock.calls);

  expectStartup(dedup, AppState.LATEST_NOT_FOUND);
  expect(getValue(dedup[2])).toStrictEqual(AppState.FAILED_REGEX);
  expect(getOccurrence(dedup[2])).toStrictEqual(INPUT.length);
});

// Test invalid session selector input - session not found
const invalidSessionMock = [NO_LATEST_SESSION, INVALID_SESSIONSELECTOR_QUERY];
test("invalid session", async () => {
  const user = userEvent.setup();

  const setAppState = vi.fn();
  const setSession = vi.fn();

  await act(() =>
    render(
      <MockedProvider mocks={invalidSessionMock}>
        <NavbarSessionSelector
          setSession={setSession}
          setAppStatus={setAppState}
        />
      </MockedProvider>
    )
  );

  const input = screen.getByRole("textbox");

  // Wait for initial request to check if latest session exists
  await waitFor(() =>
    expect(setAppState).calledWith({ state: AppState.LATEST_NOT_FOUND })
  );
  const INPUT = "mg44685-1";
  await user.type(input, INPUT);

  // Wait for final state change
  await waitFor(() =>
    expect(setAppState).calledWith({
      state: AppState.INVALID_SESSION,
      message: `Invalid session: ${INPUT} not found.`,
    })
  );

  const dedup = removeDuplicates(setAppState.mock.calls);

  expectStartup(dedup, AppState.LATEST_NOT_FOUND);
  expect(getValue(dedup[2])).toStrictEqual(AppState.FAILED_REGEX);
  expect(getOccurrence(dedup[2])).toStrictEqual(INPUT.length - 1);
  expect(getValue(dedup.slice(-1)[0])).toStrictEqual(AppState.INVALID_SESSION);
});

// Test valid session selector input
const validSessionMock = [NO_LATEST_SESSION, VALID_SESSIONSELECTOR_QUERY];
test("valid session", async () => {
  const user = userEvent.setup();

  const setAppState = vi.fn();
  const setSession = vi.fn();

  await act(() =>
    render(
      <MockedProvider mocks={validSessionMock}>
        <NavbarSessionSelector
          setSession={setSession}
          setAppStatus={setAppState}
        />
      </MockedProvider>
    )
  );

  const input = screen.getByRole("textbox");

  // Wait for initial request to check if latest session exists
  await waitFor(() =>
    expect(setAppState).toHaveBeenCalledWith({
      state: AppState.LATEST_NOT_FOUND,
    })
  );

  const SESSION = "mg44685-1";
  await user.type(input, SESSION);

  // Wait for last state change
  await waitFor(() =>
    expect(setAppState).toHaveBeenCalledWith({ state: AppState.VALID })
  );

  const dedup = removeDuplicates(setAppState.mock.calls);
  expectStartup(dedup, AppState.LATEST_NOT_FOUND);
  expect(getValue(dedup[2])).toStrictEqual(AppState.FAILED_REGEX);
  expect(getOccurrence(dedup[2])).toStrictEqual(SESSION.length - 1);
  expect(getValue(dedup.slice(-1)[0])).toStrictEqual(AppState.VALID);
});

// Test existence of latest session
const latestSessionMock = [HAS_LATEST_SESSION, VALID_SESSIONSELECTOR_QUERY];
test("latest session", async () => {
  const setAppState = vi.fn();
  const setSession = vi.fn();

  await act(() =>
    render(
      <MockedProvider mocks={latestSessionMock}>
        <NavbarSessionSelector
          setSession={setSession}
          setAppStatus={setAppState}
        />
      </MockedProvider>
    )
  );

  const input = screen.getByRole("textbox");

  const EXPECTED = "mg33746-1";

  // Wait for initial request to check if latest session exists
  await waitFor(() =>
    expect(setAppState).toHaveBeenCalledWith({ state: AppState.VALID })
  );

  const dedup = removeDuplicates(setAppState.mock.calls);

  expect(getValue(dedup[0])).toStrictEqual(AppState.LOADING);
  expect(getValue(dedup[1])).toStrictEqual(AppState.VALID);
  expect(dedup.length).toStrictEqual(2);
  expect(input.value).toStrictEqual(EXPECTED);
});

const nonImagingMock = [
  NO_LATEST_SESSION,
  VALID_SESSIONSELECTOR_QUERY_NON_IMAGING,
];
test("non-imaging beamline", async () => {
  const user = userEvent.setup();

  const setAppState = vi.fn();
  const setSession = vi.fn();

  await act(() =>
    render(
      <MockedProvider mocks={nonImagingMock}>
        <NavbarSessionSelector
          setSession={setSession}
          setAppStatus={setAppState}
        />
      </MockedProvider>
    )
  );

  await waitFor(() =>
    expect(setAppState).calledWith({ state: AppState.LATEST_NOT_FOUND })
  );
  const INPUT = "ab12345-1";

  const input = screen.getByRole("textbox");
  await user.type(input, INPUT);

  await waitFor(() =>
    expect(setAppState).calledWith({
      state: AppState.INVALID_SESSION,
      message: `Invalid session: Session ${INPUT} is associated with ${NON_IMAGING_BEAMLINE}. ${NON_IMAGING_BEAMLINE} is not an imaging beamline.`,
    })
  );

  const dedup = removeDuplicates(setAppState.mock.calls);
  expectStartup(dedup, AppState.LATEST_NOT_FOUND);
});
