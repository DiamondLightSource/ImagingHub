import React from "react";
import "@testing-library/jest-dom";
import { expect, test, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  InstrumentSession,
  SessionSelector,
} from "../src/components/SessionSelector";

afterEach(() => {
  vi.clearAllMocks();
});

const INSTRUMENT_SESSION: InstrumentSession = {
  instrument: {
    name: "test instrument",
  },
  proposal: {
    proposalNumber: 12345,
    proposalCategory: "MG",
  },
  instrumentSessionNumber: 2,
};

test("session selector input field renders latest session", async () => {
  render(<SessionSelector session={INSTRUMENT_SESSION} />);
  const sessionSelectorInput = await screen.findByTestId(
    "session-selector-input"
  );
  const input = sessionSelectorInput.querySelector("input");
  expect(input).toHaveValue("mg12345-2");
});
