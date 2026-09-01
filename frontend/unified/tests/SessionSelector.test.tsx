import React from "react";
import "@testing-library/jest-dom";
import { expect, test, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing/react";
import {
  SessionSelector,
  SESSION_QUERY,
} from "../src/components/SessionSelector";

afterEach(() => {
  vi.clearAllMocks();
});

const mocks = [
  {
    request: {
      query: SESSION_QUERY,
      variables: {},
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
                      proposalNumber: 12345,
                      proposalCategory: "MG",
                    },
                    instrumentSessionNumber: 2,
                  },
                },
              },
            ],
          },
        },
      },
    },
  },
];

test("session selector input field renders latest session from query", async () => {
  render(
    <MockedProvider mocks={mocks}>
      <SessionSelector />
    </MockedProvider>
  );
  const sessionSelectorInput = await screen.findByTestId(
    "session-selector-input"
  );
  const input = sessionSelectorInput.querySelector("input");
  expect(input).toHaveValue("mg12345-2");
});
